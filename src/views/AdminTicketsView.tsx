import React, { useState } from 'react';
import {
  Search,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Tag,
  Calendar,
  User,
  Shield,
  Trash2,
} from 'lucide-react';
import { Sidebar } from '../components/layout/Sidebar.tsx';
import { DashboardHeader } from '../components/layout/DashboardHeader.tsx';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import {
  assignTicket,
  unassignTicket,
  updateTicketStatus,
  deleteTicket,
} from '../store/ticketSlice.ts';
import { TicketCategory, TicketStatus } from '../types/index.ts';

const CATEGORIES: (TicketCategory | 'Todas')[] = [
  'Todas',
  'Hardware',
  'Software',
  'Rede e Conexão',
  'Manutenção Predial / Elétrica',
  'Equipamentos de Laboratório',
  'Outros',
];

const STATUS_OPTIONS: (TicketStatus | 'Todos')[] = [
  'Todos',
  'Aberto',
  'Em andamento',
  'Pronto',
  'Cancelado',
];

export const AdminTicketsView: React.FC = () => {
  const dispatch = useAppDispatch();
  const tickets = useAppSelector((state) => state.tickets.tickets);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | 'Todas'>('Todas');
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | 'Todos'>('Todos');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('Todos');

  // Extract unique authors
  const uniqueAuthors = Array.from(new Set(tickets.map((t) => t.author))).filter(Boolean);

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Todas' || ticket.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'Todos' || ticket.status === selectedStatus;

    const matchesAuthor =
      selectedAuthor === 'Todos' || ticket.author === selectedAuthor;

    return matchesSearch && matchesCategory && matchesStatus && matchesAuthor;
  });

  // KPI Metrics
  const totalOpen = tickets.filter((t) => t.status === 'Aberto').length;
  const totalInProgress = tickets.filter((t) => t.status === 'Em andamento').length;
  const totalAssignedToMe = tickets.filter(
    (t) => t.assignedTo === currentUser?.name && t.status !== 'Pronto'
  ).length;
  const totalCompleted = tickets.filter((t) => t.status === 'Pronto').length;

  const handleAcceptTicket = (id: string) => {
    dispatch(assignTicket({ id, assignedTo: currentUser?.name || 'Administrador' }));
  };

  const handleStatusChange = (id: string, status: TicketStatus) => {
    dispatch(updateTicketStatus({ id, status }));
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
      <Sidebar currentScreen="todos-chamados" />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DashboardHeader
          title="Gestão Geral de Chamados"
          subtitle="Visualize, aceite e gerencie todas as solicitações técnicas abertas na Fatec."
        />

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* KPI Summary Cards (3 cards: Aguardando Atendimento, Em Andamento, Concluidos) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-xs transition-colors duration-300">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Aguardando Atendimento</span>
                  <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                </div>
                <p className="text-3xl font-bold text-amber-700 dark:text-amber-400 font-mono tabular-nums">
                  {totalOpen}
                </p>
                <span className="text-[11px] text-gray-500 dark:text-slate-400">Chamados novos</span>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-xs transition-colors duration-300">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-blue-600 dark:text-sky-400">Em Andamento</span>
                  <AlertCircle className="w-4 h-4 text-blue-500 dark:text-sky-400" />
                </div>
                <p className="text-3xl font-bold text-blue-600 dark:text-sky-400 font-mono tabular-nums">
                  {totalInProgress}
                </p>
                <span className="text-[11px] text-gray-500 dark:text-slate-400">Em manutenção técnica</span>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-xs transition-colors duration-300">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Concluídos</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                </div>
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
                  {totalCompleted}
                </p>
                <span className="text-[11px] text-gray-500 dark:text-slate-400">Finalizados com sucesso</span>
              </div>
            </div>

            {/* Filter Controls Box */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-gray-200 dark:border-slate-700 p-5 transition-colors duration-300">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                    Pesquisa
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Título, código, descrição..."
                      className="w-full pl-9 pr-3 py-2 text-xs text-gray-800 dark:text-slate-100 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                    />
                  </div>
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                    Categoria
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                    className="w-full py-2 px-3 text-xs text-gray-800 dark:text-slate-100 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pessoa Enviada (Autor) */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                    Pessoa Enviada
                  </label>
                  <select
                    value={selectedAuthor}
                    onChange={(e) => setSelectedAuthor(e.target.value)}
                    className="w-full py-2 px-3 text-xs text-gray-800 dark:text-slate-100 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 cursor-pointer"
                  >
                    <option value="Todos">Todos os solicitantes</option>
                    {uniqueAuthors.map((author) => (
                      <option key={author} value={author}>
                        {author}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Estado (Status) */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                    Estado
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as any)}
                    className="w-full py-2 px-3 text-xs text-gray-800 dark:text-slate-100 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tickets List */}
            {filteredTickets.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-12 text-center transition-colors duration-300">
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Nenhum chamado encontrado para os critérios de busca selecionados.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('Todas');
                    setSelectedStatus('Todos');
                    setSelectedAuthor('Todos');
                  }}
                  className="mt-3 text-xs font-semibold text-[#990000] dark:text-red-400 hover:underline cursor-pointer active:text-[#6b0000] dark:active:text-red-300"
                >
                  Redefinir todos os filtros
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTickets.map((ticket) => {
                  const isAssignedToMe = ticket.assignedTo === currentUser?.name;
                  const isUnassigned = !ticket.assignedTo;

                  return (
                    <div
                      key={ticket.id}
                      className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 hover:border-gray-300 dark:hover:border-slate-600 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
                    >
                      {/* Left: Ticket Core Details (Clean, unboxed metadata, zero pills) */}
                      <div className="space-y-2 flex-1 min-w-0">
                        {/* Title & Status Row */}
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

                          {ticket.assignedTo ? (
                            <>
                              <span className="text-gray-300 dark:text-slate-600">·</span>
                              <span className="text-xs text-gray-600 dark:text-slate-300 font-medium">
                                Técnico: <strong className="font-semibold text-gray-800 dark:text-slate-100">{ticket.assignedTo}</strong>
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-gray-300 dark:text-slate-600">·</span>
                              <span className="text-xs text-gray-500 dark:text-slate-400">Não atribuído</span>
                            </>
                          )}
                        </div>

                        <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {ticket.details}
                        </p>

                        {/* Metadata Footer: Clean unboxed text with subtle dividers */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-slate-400 pt-2 border-t border-gray-100 dark:border-slate-700">
                          <span className="font-medium text-gray-700 dark:text-slate-200">{ticket.category}</span>
                          <span className="text-gray-300 dark:text-slate-600">·</span>
                          <span>Aberto em {ticket.createdAt}</span>
                          <span className="text-gray-300 dark:text-slate-600">·</span>
                          <span>Solicitante: <strong className="font-medium text-gray-700 dark:text-slate-200">{ticket.author}</strong></span>
                          {ticket.completedAt && (
                            <>
                              <span className="text-gray-300 dark:text-slate-600">·</span>
                              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                                Concluído em {ticket.completedAt}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right: Clean Functional Actions */}
                      <div className="flex flex-wrap items-center gap-2.5 self-end lg:self-center shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-slate-700 w-full lg:w-auto justify-end">
                        {/* ACCEPT TICKET BUTTON (Assigns to Admin) */}
                        {isUnassigned && ticket.status !== 'Pronto' && ticket.status !== 'Cancelado' && (
                          <button
                            onClick={() => handleAcceptTicket(ticket.id)}
                            className="bg-[#990000] hover:bg-[#800000] active:bg-[#6b0000] text-white text-xs font-semibold py-1.5 px-3 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Aceitar Chamado</span>
                          </button>
                        )}

                        {isAssignedToMe && ticket.status !== 'Pronto' && (
                          <button
                            onClick={() => dispatch(unassignTicket(ticket.id))}
                            className="text-xs text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 py-1.5 px-2.5 rounded-md transition-colors cursor-pointer bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-500 active:bg-gray-100 dark:active:bg-slate-600"
                            title="Liberar chamado para outros técnicos"
                          >
                            Desatribuir
                          </button>
                        )}

                        {/* CLEAN NEUTRAL STATUS SELECTOR (No colored pill or contour) */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-500 dark:text-slate-400 font-medium hidden xl:inline">
                            Estado:
                          </span>
                          <select
                            value={ticket.status}
                            onChange={(e) =>
                              handleStatusChange(ticket.id, e.target.value as TicketStatus)
                            }
                            className="text-xs font-medium py-1.5 px-2.5 rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 hover:border-gray-300 dark:hover:border-slate-500 focus:outline-none focus:border-red-600 transition-colors cursor-pointer"
                          >
                            <option value="Aberto">Aberto</option>
                            <option value="Em andamento">Em andamento</option>
                            <option value="Pronto">Pronto</option>
                            <option value="Cancelado">Cancelado</option>
                          </select>
                        </div>

                        {/* Quick Mark as Pronto */}
                        {ticket.status !== 'Pronto' && (
                          <button
                            onClick={() => handleStatusChange(ticket.id, 'Pronto')}
                            className="bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-medium py-1.5 px-3 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                            title="Marcar chamado como Pronto"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Finalizar</span>
                          </button>
                        )}

                        {/* Delete Ticket */}
                        <button
                          onClick={() => dispatch(deleteTicket(ticket.id))}
                          className="p-1.5 text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/50 active:bg-red-100 dark:active:bg-red-900/60 rounded-md transition-colors cursor-pointer"
                          title="Remover chamado"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
