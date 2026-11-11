import React from 'react';
import { ArrowLeft, Bell, User as UserIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/index.ts';
import { setScreen } from '../../store/navigationSlice.ts';
import { ThemeToggle } from '../common/ThemeToggle.tsx';

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
}) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const currentScreen = useAppSelector((state) => state.navigation.currentScreen);

  // Defaults based on screen if not overridden
  const displayTitle =
    title ||
    (currentScreen === 'abrir-chamado'
      ? 'Abrir Novo Chamado'
      : currentScreen === 'meus-chamados'
      ? 'Meus Chamados'
      : `Olá, ${currentUser?.name || 'Usuário'}`);

  const displaySubtitle =
    subtitle ||
    (currentScreen === 'abrir-chamado'
      ? 'Preencha os dados abaixo para abrir um novo chamado de suporte.'
      : currentScreen === 'meus-chamados'
      ? 'Acompanhe e gerencie o andamento dos seus chamados.'
      : 'Bem-vindo ao sistema de chamados HelpTec!');

  const hasBack =
    showBackButton || currentScreen === 'abrir-chamado' || currentScreen === 'meus-chamados';

  return (
    <header className="h-16 md:h-18 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 md:px-8 flex items-center justify-between shrink-0 select-none transition-colors duration-300">
      {/* Left: Optional Back Arrow + Title and Subtitle */}
      <div className="flex items-center gap-3">
        {hasBack && (
          <button
            onClick={() => dispatch(setScreen('inicio'))}
            className="p-1.5 -ml-1.5 rounded-lg text-gray-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer active:bg-gray-200 dark:active:bg-slate-600"
            title="Voltar ao início"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div>
          <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-slate-100 leading-tight">
            {displayTitle}
          </h2>
          <p className="text-[11px] md:text-xs text-gray-500 dark:text-slate-400 leading-tight mt-0.5">
            {displaySubtitle}
          </p>
        </div>
      </div>

      {/* Right: Theme Toggle, Notification Bell & User Avatar */}
      <div className="flex items-center gap-3 text-gray-600 dark:text-slate-300">
        <ThemeToggle />

        <button
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors relative cursor-pointer active:bg-gray-200 dark:active:bg-slate-600"
          title="Notificações"
          aria-label="Notificações"
        >
          <Bell className="w-5 h-5 stroke-[1.75]" />
        </button>

        <div
          className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-slate-700"
          title={`Conectado como ${currentUser?.name || 'Usuário'}`}
        >
          <button
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer active:bg-gray-200 dark:active:bg-slate-600"
            aria-label="Perfil do usuário"
          >
            <UserIcon className="w-5 h-5 stroke-[1.75]" />
          </button>
          <span className="hidden sm:inline-block text-xs font-medium text-gray-700 dark:text-slate-200">
            {currentUser?.name || 'Usuário'}
          </span>
        </div>
      </div>
    </header>
  );
};

