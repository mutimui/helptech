import React, { useState, useMemo } from 'react';
import {
  ClipboardList,
  Plus,
  Trash2,
  Edit3,
  Search,
  X,
  Save,
} from 'lucide-react';
import { Sidebar } from '../components/layout/Sidebar.tsx';
import { DashboardHeader } from '../components/layout/DashboardHeader.tsx';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import { setScreen } from '../store/navigationSlice.ts';
import {
  deleteTicket,
  editTicket,
  setEditingTicketId,
} from '../store/ticketSlice.ts';
import { Ticket, TicketCategory, TicketStatus } from '../types/index.ts';

const CATEGORIES: TicketCategory[] = [
  'Hardware',
  'Software',
  'Rede e Conexão',
  'Manutenção Predial / Elétrica',
  'Equipamentos de Laboratório',
  'Outros',
];
export const MyTicketsView: React.FC = () => {
  const dispatch = useAppDispatch();
  const allTickets = useAppSelector((state) => state.tickets.tickets);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  // Helper de normalizacao para ignorar acentos, maiusculas e espacos
  const normalize = (str?: string | null) =>
    (str || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  // O usuario comum ve ESTRITAMENTE APENAS os chamados criados por ele (nunca chamados de terceiros)
  const tickets = useMemo(() => {
    const myNameNorm = normalize(currentUser?.name || 'Usuário');
    const myUserNorm = normalize(currentUser?.username || 'usuario');

    return allTickets.filter((t) => {
      const ticketAuthorNorm = normalize(t.author);
      const ticketUserNorm = normalize(t.authorUsername);

      // Match direto no authorUsername
      if (ticketUserNorm && (ticketUserNorm === myUserNorm || ticketUserNorm === myNameNorm)) {
        return true;
      }

      // Match por nome de autor
      return (
        ticketAuthorNorm === myNameNorm ||
        ticketAuthorNorm === myUserNorm
      );
    });
  }, [allTickets, currentUser]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('Todos');

  // Quick Edit Modal State (Apenas Título, Categoria e Detalhes)
  const [editingModalTicket, setEditingModalTicket] = useState<Ticket | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<TicketCategory>('Hardware');
  const [editDetails, setEditDetails] = useState('');

  // Delete Confirmation State
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === 'Todos' || ticket.status === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenEditModal = (ticket: Ticket) => {
    setEditingModalTicket(ticket);
    setEditTitle(ticket.title);
    setEditCategory(ticket.category);
    setEditDetails(ticket.details);
  };

  const handleSaveModalEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModalTicket || !editTitle.trim()) return;

    dispatch(
      editTicket({
        id: editingModalTicket.id,
        title: editTitle.trim(),
        category: editCategory,
        details: editDetails.trim(),
      })
    );
    setEditingModalTicket(null);
  };

  const handleConfirmDelete = () => {
    if (ticketToDelete) {
      dispatch(deleteTicket(ticketToDelete));
      setTicketToDelete(null);
    }
  };

  const renderStatus = (status: TicketStatus) => {
    switch (status) {
      case 'Aberto':
        return <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Aberto</span>;
      case 'Em andamento':
        return <span className="text-xs font-bold text-blue-600 dark:text-sky-400">Em andamento</span>;
      case 'Pronto':
        return <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Pronto</span>;
      case 'Cancelado':
        return <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">Cancelado</span>;
    }
  };

  return (
    <div className="h-screen bg-[#F5F6F8] dark:bg-slate-900 flex flex-row font-sans overflow-hidden transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar currentScreen="meus-chamados" />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DashboardHeader
          title="Meus Chamados"
          subtitle="Acompanhe apenas as suas solicitações de suporte registradas."
        />

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {/* Top Toolbar (Filters & Actions) */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-gray-200 dark:border-slate-700 p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-300">
              {/* Search Field */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar em meus chamados..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs text-gray-800 dark:text-slate-100 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 transition-colors"
                />
              </div>

              {/* Status Filter Tabs & New Ticket Button */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-gray-100 dark:bg-slate-900 p-1 rounded-lg">
                  {['Todos', 'Aberto', 'Em andamento', 'Pronto'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatusFilter(status)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                        selectedStatusFilter === status
                          ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-xs font-semibold'
                          : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800 active:bg-gray-200 dark:active:bg-slate-600'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    dispatch(setEditingTicketId(null));
                    dispatch(setScreen('abrir-chamado'));
                  }}
                  className="bg-[#990000] hover:bg-[#800000] active:bg-[#6b0000] text-white text-xs font-semibold py-2 px-4 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ml-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Chamado</span>
                </button>
              </div>
            </div>

            {/* Content: Empty State OR Ticket List */}
            {tickets.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto mt-6 transition-colors duration-300">
                <ClipboardList className="w-10 h-10 text-gray-400 dark:text-slate-500 mb-3" />
                <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-1">
                  Você não possui nenhum chamado aberto
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-6 max-w-xs leading-relaxed">
                  Clique no botão abaixo para abrir seu primeiro chamado de manutenção no HelpTec.
                </p>
                <button
                  onClick={() => {
                    dispatch(setEditingTicketId(null));
                    dispatch(setScreen('abrir-chamado'));
                  }}
                  className="bg-[#990000] hover:bg-[#800000] active:bg-[#6b0000] text-white text-xs font-semibold py-2.5 px-6 rounded-md transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Abrir Meu Primeiro Chamado</span>
                </button>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-10 text-center transition-colors duration-300">
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Nenhum chamado seu corresponde aos filtros aplicados.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedStatusFilter('Todos');
                  }}
                  className="mt-3 text-xs font-semibold text-[#990000] dark:text-red-400 hover:underline cursor-pointer active:text-[#6b0000] dark:active:text-red-300"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 hover:border-gray-300 dark:hover:border-slate-600 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                  >
                    {/* Left: Info & Details (Clean unboxed text) */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-[#990000] dark:text-red-400">
                          #{ticket.id}
                        </span>
                        <span className="text-gray-300 dark:text-slate-600">·</span>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 truncate">
                          {ticket.title}
                        </h4>
                        <span className="text-gray-300 dark:text-slate-600">·</span>
                        {renderStatus(ticket.status)}
                      </div>

                      <p className="text-xs text-gray-600 dark:text-slate-300 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                        {ticket.details}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-slate-400 pt-2 border-t border-gray-100 dark:border-slate-700">
                        <span className="font-medium text-gray-700 dark:text-slate-200">{ticket.category}</span>
                        <span className="text-gray-300 dark:text-slate-600">·</span>
                        <span>Aberto em {ticket.createdAt}</span>
                        {ticket.assignedTo && (
                          <>
                            <span className="text-gray-300 dark:text-slate-600">·</span>
                            <span>Técnico responsável: <strong className="font-medium text-gray-700 dark:text-slate-200">{ticket.assignedTo}</strong></span>
                          </>
                        )}
                        {ticket.completedAt && (
                          <>
                            <span className="text-gray-300 dark:text-slate-600">·</span>
                            <span className="text-emerald-700 dark:text-emerald-400 font-medium">Finalizado em {ticket.completedAt}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions for User (Only Edit Title/Category/Details and Delete, NO status change) */}
                    <div className="flex items-center gap-2 self-end lg:self-center shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-slate-700 w-full lg:w-auto justify-end">
                      {/* Edit Button: User can ONLY edit Title, Category, and Details */}
                      <button
                        onClick={() => handleOpenEditModal(ticket)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-slate-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-500 active:bg-gray-100 dark:active:bg-slate-600"
                        title="Editar título, categoria e detalhes do chamado"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setTicketToDelete(ticket.id)}
                        className="p-1.5 text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/50 active:bg-red-100 dark:active:bg-red-900/60 border border-red-100 dark:border-red-900/70 rounded-md transition-colors cursor-pointer"
                        title="Excluir chamado"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* QUICK EDIT MODAL (Allows editing ONLY Title, Category, and Details) */}
      {editingModalTicket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-xl w-full p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">
                  Editar Chamado #{editingModalTicket.id}
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                  Atualize o título, a categoria ou a descrição do seu chamado.
                </p>
              </div>
              <button
                onClick={() => setEditingModalTicket(null)}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer active:bg-gray-200 dark:active:bg-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Informational Note */}
            <div className="mb-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-3 text-[11px] text-gray-600 dark:text-slate-300">
              <span className="font-semibold text-gray-800 dark:text-slate-100">Nota:</span> Como solicitante, você pode alterar apenas o <b>Título</b>, a <b>Categoria</b> e a <b>Descrição</b>. O status é controlado exclusivamente pelos técnicos de TI.
            </div>

            <form onSubmit={handleSaveModalEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-800 dark:text-slate-200 mb-1.5">
                  Título
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-800 dark:text-slate-200 mb-1.5">
                  Categoria
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as TicketCategory)}
                  className="w-full px-3 py-2 text-xs text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-800 dark:text-slate-200 mb-1.5">
                  Detalhes do chamado
                </label>
                <textarea
                  rows={5}
                  value={editDetails}
                  onChange={(e) => setEditDetails(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 resize-y"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditingModalTicket(null)}
                  className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-md cursor-pointer hover:border-gray-300 dark:hover:border-slate-500 active:bg-gray-100 dark:active:bg-slate-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#990000] hover:bg-[#800000] active:bg-[#6b0000] rounded-md flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {ticketToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700 text-center">
            <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-1">
              Excluir Chamado #{ticketToDelete}?
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-6 leading-relaxed">
              Esta ação removerá permanentemente o chamado do sistema e não poderá ser desfeita.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setTicketToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-md cursor-pointer hover:border-gray-300 dark:hover:border-slate-500 active:bg-gray-100 dark:active:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#990000] hover:bg-[#800000] active:bg-[#6b0000] rounded-md cursor-pointer"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
