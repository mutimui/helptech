import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/index.ts';
import { toggleTheme } from '../../store/themeSlice.ts';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);
  const isDark = mode === 'dark';

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      className={`relative w-9 h-9 flex items-center justify-center rounded-full bg-transparent hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 dark:active:bg-slate-600 transition-colors duration-150 cursor-pointer select-none border-0 ${
        isDark ? 'text-amber-300' : 'text-amber-500'
      } ${className}`}
      title={isDark ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
      aria-label={isDark ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Ícone de Sol (Modo Claro) */}
        <Sun
          className={`w-[18px] h-[18px] stroke-[2] absolute transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isDark
              ? 'rotate-90 scale-0 opacity-0 text-amber-400'
              : 'rotate-0 scale-100 opacity-100 text-amber-500'
          }`}
        />

        {/* Ícone de Lua (Modo Escuro) */}
        <Moon
          className={`w-[18px] h-[18px] stroke-[2] absolute transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isDark
              ? 'rotate-0 scale-100 opacity-100 text-sky-300'
              : '-rotate-90 scale-0 opacity-0 text-slate-600'
          }`}
        />
      </div>
    </button>
  );
};
