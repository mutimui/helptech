import React from 'react';
import { Plus, ClipboardList, ListFilter, CheckCircle2, BarChart3, PlusSquare } from 'lucide-react';
import { Sidebar } from '../components/layout/Sidebar.tsx';
import { DashboardHeader } from '../components/layout/DashboardHeader.tsx';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import { setScreen } from '../store/navigationSlice.ts';

export const HomeView: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="h-screen bg-[#F5F6F8] dark:bg-slate-900 flex flex-row font-sans overflow-hidden transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar currentScreen="inicio" />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DashboardHeader />

        {/* Content Area with Centered Action Cards */}
        <main className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
          {isAdmin ? (
            /* ADMIN HOME CARDS */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full">
              {/* Card 1: Todos os Chamados */}
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-7 flex flex-col items-center text-center shadow-[0_4px_25px_rgba(0,0,0,0.04)] transition-colors">
                <div className="w-13 h-13 text-[#990000] dark:text-red-400 flex items-center justify-center mb-4">
                  <ListFilter className="w-7 h-7 stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-1">
                  Todos os Chamados
                </h3>
                <p className="text-xs text-gray-600 dark:text-slate-400 mb-5 leading-relaxed max-w-[200px]">
                  Aceite solicitações e gerencie a fila técnica geral
                </p>
                <button
                  onClick={() => dispatch(setScreen('todos-chamados'))}
                  className="bg-[#990000] hover:bg-[#800000] active:bg-[#6b0000] text-white text-xs font-semibold py-2 px-5 rounded-lg transition-colors cursor-pointer mt-auto"
                >
                  Gerenciar Fila
                </button>
              </div>

              {/* Card 2: Chamados Concluídos */}
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-7 flex flex-col items-center text-center shadow-[0_4px_25px_rgba(0,0,0,0.04)] transition-colors">
                <div className="w-13 h-13 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-7 h-7 stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-1">
                  Chamados Concluídos
                </h3>
                <p className="text-xs text-gray-600 dark:text-slate-400 mb-5 leading-relaxed max-w-[200px]">
                  Arquivo de solicitações marcadas como prontas
                </p>
                <button
                  onClick={() => dispatch(setScreen('chamados-concluidos'))}
                  className="bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 ring-1 ring-inset ring-gray-200 dark:ring-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 hover:ring-gray-300 dark:hover:ring-slate-500 active:bg-gray-100 dark:active:bg-slate-600 text-xs font-semibold py-2 px-5 rounded-lg transition-colors cursor-pointer mt-auto"
                >
                  Ver Concluídos
                </button>
              </div>

              {/* Card 3: Análises e Gráficos */}
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-7 flex flex-col items-center text-center shadow-[0_4px_25px_rgba(0,0,0,0.04)] transition-colors">
                <div className="w-13 h-13 text-gray-600 dark:text-slate-300 flex items-center justify-center mb-4">
                  <BarChart3 className="w-7 h-7 stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-1">
                  Análises e Gráficos
                </h3>
                <p className="text-xs text-gray-600 dark:text-slate-400 mb-5 leading-relaxed max-w-[200px]">
                  Volumetria mensal e ranking por categoria
                </p>
                <button
                  onClick={() => dispatch(setScreen('analises'))}
                  className="bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 ring-1 ring-inset ring-gray-200 dark:ring-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 hover:ring-gray-300 dark:hover:ring-slate-500 active:bg-gray-100 dark:active:bg-slate-600 text-xs font-semibold py-2 px-5 rounded-lg transition-colors cursor-pointer mt-auto"
                >
                  Ver Estatísticas
                </button>
              </div>
            </div>
          ) : (
            /* STANDARD USER CARDS */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl w-full">
              {/* Card 1: Abrir novo chamado */}
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-8 md:p-10 flex flex-col items-center text-center shadow-[0_4px_25px_rgba(0,0,0,0.04)] transition-colors">
                <div className="w-14 h-14 text-[#990000] dark:text-red-400 flex items-center justify-center mb-5">
                  <Plus className="w-8 h-8 stroke-[2.5]" />
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-1.5">
                  Abrir novo chamado
                </h3>

                <p className="text-xs text-gray-600 dark:text-slate-400 mb-6 max-w-[210px] leading-relaxed">
                  Abra um novo chamado
                </p>

                <button
                  onClick={() => dispatch(setScreen('abrir-chamado'))}
                  className="bg-[#990000] hover:bg-[#800000] active:bg-[#6b0000] text-white text-xs font-semibold py-2.5 px-6 rounded-lg transition-colors cursor-pointer mt-auto"
                >
                  Abrir Chamados
                </button>
              </div>

              {/* Card 2: Meus chamados */}
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-8 md:p-10 flex flex-col items-center text-center shadow-[0_4px_25px_rgba(0,0,0,0.04)] transition-colors">
                <div className="w-14 h-14 text-gray-600 dark:text-slate-300 flex items-center justify-center mb-5">
                  <ClipboardList className="w-8 h-8 stroke-[2]" />
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-1.5">
                  Meus chamados
                </h3>

                <p className="text-xs text-gray-600 dark:text-slate-400 mb-6 max-w-[210px] leading-relaxed">
                  Acompanhe seus chamados
                </p>

                <button
                  onClick={() => dispatch(setScreen('meus-chamados'))}
                  className="bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 ring-1 ring-inset ring-gray-200 dark:ring-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 hover:ring-gray-300 dark:hover:ring-slate-500 active:bg-gray-100 dark:active:bg-slate-600 text-xs font-semibold py-2.5 px-6 rounded-lg transition-colors cursor-pointer mt-auto"
                >
                  Meus Chamados
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
