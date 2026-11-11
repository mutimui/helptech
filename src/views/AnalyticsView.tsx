import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  CheckCircle2,
  Filter,
  Flame,
} from 'lucide-react';
import { Sidebar } from '../components/layout/Sidebar.tsx';
import { DashboardHeader } from '../components/layout/DashboardHeader.tsx';
import { useAppSelector } from '../store/index.ts';
import { TicketCategory, TicketStatus } from '../types/index.ts';

const MONTH_NAMES = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

const ALL_CATEGORIES: TicketCategory[] = [
  'Hardware',
  'Software',
  'Rede e Conexão',
  'Manutenção Predial / Elétrica',
  'Equipamentos de Laboratório',
  'Outros',
];

export const AnalyticsView: React.FC = () => {
  const tickets = useAppSelector((state) => state.tickets.tickets);

  // Filters for Category Analysis
  const [categoryStatusFilter, setCategoryStatusFilter] = useState<'Todos' | TicketStatus>('Todos');
  const [periodFilter, setPeriodFilter] = useState<'all' | 'sem1' | 'sem2'>('all');
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const currentYear = new Date().getFullYear();

  // 1. DATA FOR MONTHLY CHART (Year 2026)
  const monthlyData = useMemo(() => {
    const counts = new Array(12).fill(0);

    tickets.forEach((ticket) => {
      let monthIndex = -1;

      if (ticket.createdAtTimestamp) {
        const date = new Date(ticket.createdAtTimestamp);
        if (date.getFullYear() === currentYear) {
          monthIndex = date.getMonth();
        }
      } else if (ticket.createdAt) {
        const parts = ticket.createdAt.split('/');
        if (parts.length >= 2) {
          const m = parseInt(parts[1], 10) - 1;
          if (m >= 0 && m < 12) {
            monthIndex = m;
          }
        }
      }

      if (monthIndex >= 0 && monthIndex < 12) {
        counts[monthIndex]++;
      }
    });

    const maxCount = Math.max(...counts, 1);
    const totalYear = counts.reduce((acc, c) => acc + c, 0);

    let peakIndex = 0;
    let peakVal = 0;
    counts.forEach((c, idx) => {
      if (c > peakVal) {
        peakVal = c;
        peakIndex = idx;
      }
    });

    return {
      counts,
      maxCount,
      totalYear,
      peakMonth: peakVal > 0 ? MONTH_NAMES[peakIndex] : '—',
      peakVal,
    };
  }, [tickets, currentYear]);

  // 2. DATA FOR CATEGORY CHART (With filters)
  const categoryData = useMemo(() => {
    const filtered = tickets.filter((t) => {
      if (categoryStatusFilter !== 'Todos' && t.status !== categoryStatusFilter) {
        return false;
      }

      if (periodFilter !== 'all' && t.createdAtTimestamp) {
        const m = new Date(t.createdAtTimestamp).getMonth();
        if (periodFilter === 'sem1' && m > 5) return false;
        if (periodFilter === 'sem2' && m <= 5) return false;
      }

      return true;
    });

    const categoryCounts: Record<TicketCategory, number> = {
      Hardware: 0,
      Software: 0,
      'Rede e Conexão': 0,
      'Manutenção Predial / Elétrica': 0,
      'Equipamentos de Laboratório': 0,
      Outros: 0,
    };

    filtered.forEach((t) => {
      if (categoryCounts[t.category] !== undefined) {
        categoryCounts[t.category]++;
      } else {
        categoryCounts['Outros']++;
      }
    });

    const totalFiltered = filtered.length || 1;

    const sorted = ALL_CATEGORIES.map((cat) => ({
      category: cat,
      count: categoryCounts[cat],
      percentage: Math.round((categoryCounts[cat] / totalFiltered) * 100),
    })).sort((a, b) => b.count - a.count);

    const leader = filtered.length > 0 ? sorted[0] : null;

    return {
      sorted,
      totalFiltered: filtered.length,
      leader,
    };
  }, [tickets, categoryStatusFilter, periodFilter]);

  // General KPIs
  const totalTickets = tickets.length;
  const completedTickets = tickets.filter((t) => t.status === 'Pronto').length;
  const completionRate = totalTickets > 0 ? Math.round((completedTickets / totalTickets) * 100) : 0;

  return (
    <div className="h-screen bg-[#F5F6F8] dark:bg-slate-900 flex flex-row font-sans overflow-hidden transition-colors duration-300">
      <Sidebar currentScreen="analises" />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DashboardHeader
          title="Análises e Estatísticas de Manutenção"
          subtitle="Gráficos de volumetria mensal e incidência de chamados por categoria de suporte."
        />

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-xs transition-colors duration-300">
                <div className="flex items-center justify-between text-gray-500 dark:text-slate-400 mb-1">
                  <span className="text-xs font-medium">Total no Ano ({currentYear})</span>
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 font-mono tabular-nums">
                  {monthlyData.totalYear}
                </p>
                <span className="text-[11px] text-gray-500 dark:text-slate-400">Chamados registrados</span>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-xs transition-colors duration-300">
                <div className="flex items-center justify-between text-gray-500 dark:text-slate-400 mb-1">
                  <span className="text-xs font-medium">Taxa de Conclusão</span>
                  <CheckCircle2 className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                </div>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
                  {completionRate}%
                </p>
                <span className="text-[11px] text-gray-500 dark:text-slate-400">
                  {completedTickets} de {totalTickets} finalizados
                </span>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-xs transition-colors duration-300">
                <div className="flex items-center justify-between text-gray-500 dark:text-slate-400 mb-1">
                  <span className="text-xs font-medium">Categoria Líder</span>
                  <Flame className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                </div>
                <p className="text-base font-bold text-gray-900 dark:text-slate-100 truncate mt-0.5">
                  {categoryData.leader?.category || '—'}
                </p>
                <span className="text-[11px] text-gray-500 dark:text-slate-400">
                  {categoryData.leader?.count ?? 0} pedidos ({categoryData.leader?.percentage ?? 0}%)
                </span>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-xs transition-colors duration-300">
                <div className="flex items-center justify-between text-gray-500 dark:text-slate-400 mb-1">
                  <span className="text-xs font-medium">Mês com Mais Pedidos</span>
                  <TrendingUp className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 font-mono tabular-nums">
                  {monthlyData.peakMonth}
                </p>
                <span className="text-[11px] text-gray-500 dark:text-slate-400">
                  {monthlyData.peakVal} solicitações no pico
                </span>
              </div>
            </div>

            {/* GRÁFICO 1: Volumetria Mensal (Ano Atual) */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-xs transition-colors duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                <div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#990000] dark:text-red-400" />
                    <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">
                      Pedidos de Manutenção por Mês ({currentYear})
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                    Distribuição da quantidade de chamados abertos ao longo de cada mês do ano vigente.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-semibold text-gray-600 dark:text-slate-300">
                    Ano: {currentYear}
                  </span>
                </div>
              </div>

              {/* Monthly Bar Chart Canvas */}
              <div className="h-60 pt-6 pb-2 flex items-end justify-between gap-2 md:gap-4 px-2 select-none border-b border-gray-200 dark:border-slate-700">
                {MONTH_NAMES.map((name, index) => {
                  const count = monthlyData.counts[index];
                  const heightPercent =
                    monthlyData.maxCount > 0 ? (count / monthlyData.maxCount) * 100 : 0;
                  const isPeak = count === monthlyData.peakVal && count > 0;
                  const isHovered = hoveredMonth === index;

                  return (
                    <div
                      key={name}
                      onMouseEnter={() => setHoveredMonth(index)}
                      onMouseLeave={() => setHoveredMonth(null)}
                      className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                    >
                      {/* Tooltip on hover */}
                      {isHovered && (
                        <div className="absolute -top-9 bg-gray-900 dark:bg-slate-700 text-white text-[11px] px-2 py-0.5 rounded shadow-sm whitespace-nowrap z-10 pointer-events-none">
                          {name}: {count} chamados
                        </div>
                      )}

                      {/* Bar Count Label */}
                      <span
                        className={`text-[11px] font-mono tabular-nums mb-1 font-bold ${
                          isPeak ? 'text-[#990000] dark:text-red-400' : 'text-gray-500 dark:text-slate-400'
                        }`}
                      >
                        {count > 0 ? count : ''}
                      </span>

                      {/* Bar visual */}
                      <div
                        className={`w-full max-w-[38px] rounded-t-sm transition-all duration-300 ${
                          isPeak
                            ? 'bg-[#990000] dark:bg-red-500'
                            : isHovered
                            ? 'bg-[#b32424] dark:bg-red-400'
                            : count > 0
                            ? 'bg-[#888888] dark:bg-slate-500'
                            : 'bg-gray-100 dark:bg-slate-700/60'
                        }`}
                        style={{
                          height: `${heightPercent}%`,
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Month Labels Below */}
              <div className="flex items-center justify-between gap-2 md:gap-4 px-2 pt-2 text-xs font-semibold text-gray-500 dark:text-slate-400">
                {MONTH_NAMES.map((name, index) => (
                  <div
                    key={name}
                    className={`flex-1 text-center truncate ${
                      monthlyData.counts[index] === monthlyData.peakVal && monthlyData.peakVal > 0
                        ? 'text-[#990000] dark:text-red-400 font-bold'
                        : ''
                    }`}
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>

            {/* GRÁFICO 2: Pedidos por Categoria (Ranking de Manutenção) */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-xs transition-colors duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                <div>
                  <div className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-[#990000] dark:text-red-400" />
                    <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">
                      Incidência de Pedidos por Categoria
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                    Identificação de qual categoria teve mais solicitações de suporte e manutenção.
                  </p>
                </div>

                {/* Filters for Category Chart */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-gray-400 dark:text-slate-400" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-slate-300">Status:</span>
                    <select
                      value={categoryStatusFilter}
                      onChange={(e) => setCategoryStatusFilter(e.target.value as any)}
                      className="py-1 px-2.5 text-xs text-gray-800 dark:text-slate-100 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md focus:outline-none focus:border-red-600 cursor-pointer"
                    >
                      <option value="Todos">Todos os status</option>
                      <option value="Pronto">Apenas Prontos</option>
                      <option value="Em andamento">Em andamento</option>
                      <option value="Aberto">Apenas Abertos</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-gray-600 dark:text-slate-300">Período:</span>
                    <select
                      value={periodFilter}
                      onChange={(e) => setPeriodFilter(e.target.value as any)}
                      className="py-1 px-2.5 text-xs text-gray-800 dark:text-slate-100 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md focus:outline-none focus:border-red-600 cursor-pointer"
                    >
                      <option value="all">Ano Completo</option>
                      <option value="sem1">1º Semestre</option>
                      <option value="sem2">2º Semestre</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Category Breakdown Clean Bars */}
              <div className="space-y-3">
                {categoryData.sorted.map((item, idx) => {
                  const isTop = idx === 0 && item.count > 0;

                  return (
                    <div
                      key={item.category}
                      className="p-3.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-gray-300 dark:hover:border-slate-600 transition-all"
                    >
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gray-500 dark:text-slate-400">
                            #{idx + 1}
                          </span>
                          <span className="text-gray-900 dark:text-slate-100 font-bold">
                            {item.category}
                          </span>
                          {isTop && (
                            <span className="text-xs font-semibold text-red-700 dark:text-red-400">
                              · Mais Solicitada
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono text-gray-700 dark:text-slate-200 font-medium tabular-nums">
                            {item.count} chamado(s)
                          </span>
                          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 w-10 text-right font-mono tabular-nums">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>

                      {/* Progress Track */}
                      <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isTop ? 'bg-[#990000] dark:bg-red-500' : 'bg-[#6b7280] dark:bg-slate-400'
                          }`}
                          style={{
                            width: `${item.percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>


          </div>
        </main>
      </div>
    </div>
  );
};
