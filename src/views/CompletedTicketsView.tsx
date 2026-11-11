import React, { useState } from 'react';
import {
  CheckCircle2,
  Search,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Sidebar } from '../components/layout/Sidebar.tsx';
import { DashboardHeader } from '../components/layout/DashboardHeader.tsx';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import { updateTicketStatus } from '../store/ticketSlice.ts';
import { TicketCategory } from '../types/index.ts';

const CATEGORIES: (TicketCategory | 'Todas')[] = [
  'Todas',
  'Hardware',
  'Software',
  'Rede e Conexão',
  'Manutenção Predial / Elétrica',
  'Equipamentos de Laboratório',
  'Outros',
];

export const CompletedTicketsView: React.FC = () => {
  const dispatch = useAppDispatch();
  const tickets = useAppSelector((state) => state.tickets.tickets);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | 'Todas'>('Todas');

  // Filter only completed tickets (status === 'Pronto')
  const completedTickets = tickets.filter((t) => t.status === 'Pronto');

  const filteredTickets = completedTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Todas' || ticket.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleReopen = (id: string) => {
    dispatch(updateTicketStatus({ id, status: 'Em andamento' }));
  };

  return (
    <div className="h-screen bg-[#F5F6F8] dark:bg-slate-900 flex flex-row font-sans overflow-hidden transition-colors duration-300">
      <Sidebar currentScreen="chamados-concluidos" />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DashboardHeader
          title="Chamados Concluídos"
          subtitle="Histórico completo de chamados finalizados e prontos com sucesso."
        />

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Clean Summary Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs transition-colors duration-300">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">Arquivo de Chamados Prontos</h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 max-w-xl">
                  Registros de manutenções finalizadas com data de conclusão e identificação técnica.
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-gray-200 dark:sm:border-slate-700 sm:pl-6">
                <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-slate-400 font-semibold block">
                  Total Finalizados
                </span>
                <span className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 font-mono tabular-nums">
                  {completedTickets.length}
                </span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-gray-200 dark:border-slate-700 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="w-4 h-4 text-gray-400 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar chamados concluídos..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs text-gray-800 dark:text-slate-100 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-semibold text-gray-600 dark:text-slate-300">Categoria:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="py-1.5 px-3 text-xs text-gray-800 dark:text-slate-100 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Completed Tickets List */}
            {filteredTickets.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-12 text-center transition-colors duration-300">
                <div className="w-10 h-10 text-gray-400 dark:text-slate-500 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-800 dark:text-slate-100">
                  {completedTickets.length === 0
                    ? 'Nenhum chamado marcado como pronto ainda.'
                    : 'Nenhum chamado corresponde aos filtros aplicados.'}
                </h4>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  {completedTickets.length === 0
                    ? 'Quando um chamado for marcado como "Pronto" na tela de Gestão, ele aparecerá catalogado nesta aba.'
                    : 'Tente alterar os termos da busca ou a categoria selecionada.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 hover:border-gray-300 dark:hover:border-slate-600 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
                  >
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
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          Pronto
                        </span>

                        {ticket.assignedTo && (
                          <>
                            <span className="text-gray-300 dark:text-slate-600">·</span>
                            <span className="text-xs text-gray-600 dark:text-slate-300 font-medium">
                              Resolvido por: <strong className="font-semibold text-gray-800 dark:text-slate-100">{ticket.assignedTo}</strong>
                            </span>
                          </>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {ticket.details}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-slate-400 pt-2 border-t border-gray-100 dark:border-slate-700">
                        <span className="font-medium text-gray-700 dark:text-slate-200">{ticket.category}</span>
                        <span className="text-gray-300 dark:text-slate-600">·</span>
                        <span>Aberto em {ticket.createdAt}</span>
                        <span className="text-gray-300 dark:text-slate-600">·</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                          Finalizado em {ticket.completedAt || ticket.createdAt}
                        </span>
                        <span className="text-gray-300 dark:text-slate-600">·</span>
                        <span>Solicitante: <strong className="font-medium text-gray-700 dark:text-slate-200">{ticket.author}</strong></span>
                      </div>
                    </div>

                    <div className="self-end lg:self-center shrink-0">
                      <button
                        onClick={() => handleReopen(ticket.id)}
                        className="text-xs text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 py-1.5 px-3 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-500 active:bg-gray-100 dark:active:bg-slate-600"
                        title="Reabrir chamado para nova manutenção"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reabrir</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
