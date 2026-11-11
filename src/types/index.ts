export interface User {
  username: string;
  name: string;
  role: 'admin' | 'usuario';
}

export type TicketCategory =
  | 'Hardware'
  | 'Software'
  | 'Rede e Conexão'
  | 'Manutenção Predial / Elétrica'
  | 'Equipamentos de Laboratório'
  | 'Outros';

export type TicketStatus =
  | 'Aberto'
  | 'Em andamento'
  | 'Pronto'
  | 'Cancelado';

export interface Ticket {
  id: string;
  title: string;
  category: TicketCategory;
  details: string;
  createdAt: string; // ISO or formatted date
  createdAtTimestamp: number; // For month/year analytics grouping
  author: string;
  authorUsername?: string;
  status: TicketStatus;
  assignedTo?: string | null;
  completedAt?: string | null;
}

export type ActiveScreen =
  | 'login'
  | 'inicio'
  | 'abrir-chamado'
  | 'meus-chamados'
  | 'todos-chamados'
  | 'chamados-concluidos'
  | 'analises';
