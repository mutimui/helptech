import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ticket, TicketCategory, TicketStatus } from '../types/index.ts';

interface TicketState {
  tickets: Ticket[];
  editingTicketId: string | null;
  selectedTicketId: string | null;
}

const LEGACY_SAMPLE_DATES: Record<string, string> = {
  'TICK-1024': '12/02/2026, 09:30',
  'TICK-1089': '18/03/2026, 11:20',
  'TICK-1142': '05/04/2026, 14:10',
  'TICK-1205': '22/05/2026, 15:45',
  'TICK-1288': '10/06/2026, 08:50',
  'TICK-1334': '14/07/2026, 16:30',
  'TICK-1410': '03/08/2026, 10:00',
  'TICK-1455': '19/08/2026, 08:15',
  'TICK-1520': '08/09/2026, 13:40',
  'TICK-1588': '25/09/2026, 17:00',
  'TICK-1640': '04/10/2026, 10:20',
  'TICK-1675': '12/10/2026, 14:50',
  'TICK-1701': '18/10/2026, 09:10',
  'TICK-1712': '20/10/2026, 08:30',
};

const loadPersistedTickets = (): Ticket[] => {
  let tickets: Ticket[] = [];
  let hasCurrentStorage = false;
  for (const key of ['helptec_tickets_v3', 'helptec_tickets_v2']) {
    try {
      const raw = localStorage.getItem(key);
      if (key === 'helptec_tickets_v3') hasCurrentStorage = raw !== null;
      if (raw === null) continue;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.every((t) =>
        t && typeof t.id === 'string' && typeof t.author === 'string' &&
        typeof t.createdAt === 'string'
      )) {
        throw new Error('Formato de chamados persistidos inválido.');
      }
      // Match immutable creation dates too: new tickets can reuse a sample's random ID.
      const cleaned: Ticket[] = parsed
        .filter((t: Ticket) => LEGACY_SAMPLE_DATES[t.id] !== t.createdAt)
        .map((t: Ticket) => ({
          ...t,
          authorUsername: t.authorUsername ||
            (t.author.toLowerCase().includes('admin') ? 'admin' : 'usuario'),
        }));
      saveTicketsToStorage(cleaned, key);
      if (key === 'helptec_tickets_v3' || !hasCurrentStorage) tickets = cleaned;
    } catch (err) {
      console.warn('Erro ao carregar chamados persistidos:', err);
    }
  }
  if (!hasCurrentStorage) saveTicketsToStorage(tickets);
  return tickets;
};

const saveTicketsToStorage = (tickets: Ticket[], key = 'helptec_tickets_v3') => {
  try {
    localStorage.setItem(key, JSON.stringify(tickets));
  } catch (err) {
    console.warn('Erro ao salvar chamados no localStorage:', err);
  }
};

const initialState: TicketState = {
  tickets: loadPersistedTickets(),
  editingTicketId: null,
  selectedTicketId: null,
};

export interface AddTicketPayload {
  title: string;
  category: TicketCategory;
  details: string;
  author: string;
  authorUsername?: string;
}

export interface EditTicketPayload {
  id: string;
  title: string;
  category: TicketCategory;
  details: string;
}

export interface UpdateStatusPayload {
  id: string;
  status: TicketStatus;
}

export interface AssignTicketPayload {
  id: string;
  assignedTo: string;
}

export const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    // CREATE
    addTicket: (state, action: PayloadAction<AddTicketPayload>) => {
      const now = new Date();
      const newTicket: Ticket = {
        ...action.payload,
        id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: now.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        createdAtTimestamp: now.getTime(),
        authorUsername: action.payload.authorUsername || 'usuario',
        status: 'Aberto',
        assignedTo: null,
        completedAt: null,
      };
      state.tickets.unshift(newTicket);
      saveTicketsToStorage(state.tickets);
    },

    // ACCEPT / ASSIGN TICKET TO ADMIN
    assignTicket: (state, action: PayloadAction<AssignTicketPayload>) => {
      const { id, assignedTo } = action.payload;
      const ticket = state.tickets.find((t) => t.id === id);
      if (ticket) {
        ticket.assignedTo = assignedTo;
        if (ticket.status === 'Aberto') {
          ticket.status = 'Em andamento';
        }
        saveTicketsToStorage(state.tickets);
      }
    },

    // UNASSIGN TICKET
    unassignTicket: (state, action: PayloadAction<string>) => {
      const ticket = state.tickets.find((t) => t.id === action.payload);
      if (ticket) {
        ticket.assignedTo = null;
        saveTicketsToStorage(state.tickets);
      }
    },

    // UPDATE / EDIT
    editTicket: (state, action: PayloadAction<EditTicketPayload>) => {
      const { id, title, category, details } = action.payload;
      const ticket = state.tickets.find((t) => t.id === id);
      if (ticket) {
        ticket.title = title;
        ticket.category = category;
        ticket.details = details;
        saveTicketsToStorage(state.tickets);
      }
      if (state.editingTicketId === id) {
        state.editingTicketId = null;
      }
    },

    // UPDATE STATUS
    updateTicketStatus: (state, action: PayloadAction<UpdateStatusPayload>) => {
      const { id, status } = action.payload;
      const ticket = state.tickets.find((t) => t.id === id);
      if (ticket) {
        ticket.status = status;
        if (status === 'Pronto') {
          ticket.completedAt = new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        } else {
          ticket.completedAt = null;
        }
        saveTicketsToStorage(state.tickets);
      }
    },

    // DELETE / REMOVE
    deleteTicket: (state, action: PayloadAction<string>) => {
      state.tickets = state.tickets.filter((t) => t.id !== action.payload);
      saveTicketsToStorage(state.tickets);
      if (state.editingTicketId === action.payload) {
        state.editingTicketId = null;
      }
      if (state.selectedTicketId === action.payload) {
        state.selectedTicketId = null;
      }
    },

    // EDIT STATE CONTROLS
    setEditingTicketId: (state, action: PayloadAction<string | null>) => {
      state.editingTicketId = action.payload;
    },

    selectTicket: (state, action: PayloadAction<string | null>) => {
      state.selectedTicketId = action.payload;
    },
  },
});

export const {
  addTicket,
  assignTicket,
  unassignTicket,
  editTicket,
  updateTicketStatus,
  deleteTicket,
  setEditingTicketId,
  selectTicket,
} = ticketSlice.actions;

export default ticketSlice.reducer;
