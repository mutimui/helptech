import React from 'react';
import {
  PlusSquare,
  ClipboardList,
  LogOut,
  UserCheck,
  CheckCircle2,
  BarChart3,
  ListFilter,
  ShieldAlert,
} from 'lucide-react';
import { HelpTecBrand } from '../brand/HelpTecBrand.tsx';
import { useAppDispatch, useAppSelector } from '../../store/index.ts';
import { setScreen } from '../../store/navigationSlice.ts';
import { logout } from '../../store/authSlice.ts';
import { ActiveScreen } from '../../types/index.ts';

interface SidebarProps {
  currentScreen: ActiveScreen;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentScreen }) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const isAdmin = currentUser?.role === 'admin';

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setScreen('login'));
  };

  return (
    <aside className="w-56 md:w-64 bg-[#990000] h-screen sticky top-0 text-white flex flex-col pt-6 pb-6 shrink-0 shadow-md select-none z-20">
      {/* Top Brand Lockup */}
      <div
        className="px-4 cursor-pointer"
        onClick={() => dispatch(setScreen('inicio'))}
        title="Ir para o Início"
      >
        <HelpTecBrand variant="sidebar" />
      </div>

      {/* Role Badge if Admin (Clean without background box) */}
      {isAdmin && (
        <div className="mx-4 mt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-amber-200">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Painel do Administrador</span>
        </div>
      )}

      {/* Divider */}
      <div className="border-b border-white/20 mx-4 my-4" />

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
        {isAdmin ? (
          /* ADMIN MENU */
          <>
            <div className="px-3 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-white/70">
              Gestão de Chamados
            </div>

            <button
              onClick={() => dispatch(setScreen('todos-chamados'))}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors text-left active:bg-black/25 cursor-pointer ${
                currentScreen === 'todos-chamados' || currentScreen === 'inicio'
                  ? 'bg-black/25 text-white shadow-inner font-semibold'
                  : 'text-white/90 hover:bg-black/15 hover:text-white'
              }`}
            >
              <ListFilter className="w-4 h-4 shrink-0" />
              <span>Todos os Chamados</span>
            </button>

            <button
              onClick={() => dispatch(setScreen('chamados-concluidos'))}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors text-left active:bg-black/25 cursor-pointer ${
                currentScreen === 'chamados-concluidos'
                  ? 'bg-black/25 text-white shadow-inner font-semibold'
                  : 'text-white/90 hover:bg-black/15 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Chamados Concluídos</span>
            </button>

            <button
              onClick={() => dispatch(setScreen('analises'))}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors text-left active:bg-black/25 cursor-pointer ${
                currentScreen === 'analises'
                  ? 'bg-black/25 text-white shadow-inner font-semibold'
                  : 'text-white/90 hover:bg-black/15 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Análises e Gráficos</span>
            </button>

          </>
        ) : (
          /* STANDARD USER MENU */
          <>
            <button
              onClick={() => dispatch(setScreen('abrir-chamado'))}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors text-left active:bg-black/25 cursor-pointer ${
                currentScreen === 'abrir-chamado'
                  ? 'bg-black/25 text-white shadow-inner font-semibold'
                  : 'text-white/90 hover:bg-black/15 hover:text-white'
              }`}
            >
              <PlusSquare className="w-4 h-4 shrink-0" />
              <span>Abrir Chamado</span>
            </button>

            <button
              onClick={() => dispatch(setScreen('meus-chamados'))}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors text-left active:bg-black/25 cursor-pointer ${
                currentScreen === 'meus-chamados'
                  ? 'bg-black/25 text-white shadow-inner font-semibold'
                  : 'text-white/90 hover:bg-black/15 hover:text-white'
              }`}
            >
              <ClipboardList className="w-4 h-4 shrink-0" />
              <span>Meus Chamados</span>
            </button>
          </>
        )}
      </nav>

      {/* Bottom Area: User Info + Logout Button */}
      <div className="px-3 pt-3 border-t border-white/15 space-y-2 mt-auto">
        {currentUser && (
          <div className="px-3 py-1.5 flex items-center gap-2.5 text-white/90">
            <UserCheck className="w-4 h-4 text-white/80 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-white/70 capitalize truncate">
                {isAdmin ? 'Administrador TI' : 'Usuário Padrão'}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 active:bg-black/25 transition-colors cursor-pointer group"
          title="Encerrar sessão e voltar ao login"
        >
          <span className="flex items-center gap-2">
            <LogOut className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
            <span>Sair da conta</span>
          </span>
          <span className="text-white/60 group-hover:text-white transition-transform group-hover:translate-x-0.5">
            ➔
          </span>
        </button>
      </div>
    </aside>
  );
};
