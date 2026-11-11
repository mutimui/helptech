import React, { useState } from 'react';
import { FatecHeader } from '../components/layout/FatecHeader.tsx';
import { HelpTecBrand } from '../components/brand/HelpTecBrand.tsx';
import { ThemeToggle } from '../components/common/ThemeToggle.tsx';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import { login, clearAuthError } from '../store/authSlice.ts';
import { setScreen } from '../store/navigationSlice.ts';

export const LoginView: React.FC = () => {
  const dispatch = useAppDispatch();
  const authError = useAppSelector((state) => state.auth.error);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      return;
    }

    dispatch(login({ username, password, rememberMe }));

    // Check if login was valid by checking hardcoded credentials directly or state
    const lowerUser = username.trim().toLowerCase();
    const isValid =
      (lowerUser === 'admin' && password === 'admin') ||
      (lowerUser === 'usuario' && password === 'usuario');

    if (isValid) {
      dispatch(setScreen('inicio'));
    }
  };

  const handleQuickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    dispatch(clearAuthError());
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-slate-900 flex flex-col font-sans transition-colors duration-300">
      {/* Top Red Institutional Fatec Header */}
      <FatecHeader />

      {/* Main Centered Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 md:py-16">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          {/* Left Column: HelpTec Brand & Mascot */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <HelpTecBrand variant="login" />
          </div>

          {/* Right Column: Login Card */}
          <div className="relative w-full max-w-[420px] bg-white dark:bg-slate-800 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.35)] border border-gray-100 dark:border-slate-700 p-8 md:p-10 shrink-0 transition-colors duration-300">
            {/* Theme Toggle in Top-Right Corner of Welcome Card */}
            <div className="absolute top-4 right-4">
              <ThemeToggle />
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-[26px] font-bold text-gray-900 dark:text-slate-100 tracking-tight">
                Bem-vindo!
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                Faça login para acessar o sistema
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-lg">
                {authError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Usuário Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 dark:text-slate-200 mb-1.5">
                  Usuário
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (authError) dispatch(clearAuthError());
                  }}
                  placeholder="Digite seu usuário"
                  className="w-full px-3.5 py-2.5 text-xs text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 transition-colors"
                  required
                />
              </div>

              {/* Senha Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 dark:text-slate-200 mb-1.5">
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (authError) dispatch(clearAuthError());
                  }}
                  placeholder="Digite sua senha"
                  className="w-full px-3.5 py-2.5 text-xs text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 transition-colors"
                  required
                />
              </div>

              {/* Lembre-me & Esqueceu sua senha? */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-[#990000] focus:ring-[#990000]"
                  />
                  <span>Lembre-me</span>
                </label>

                <button
                  type="button"
                  className="text-[#990000] dark:text-red-400 font-bold hover:underline cursor-pointer text-xs active:text-[#6b0000] dark:active:text-red-300"
                >
                  Esqueceu sua senha?
                </button>
              </div>

              {/* Entrar Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#990000] hover:bg-[#800000] active:bg-[#6b0000] text-white font-semibold text-sm py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Entrar
                </button>
              </div>
            </form>

            {/* Quick credentials hint for evaluation convenience */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700 text-center">
              <p className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 mb-2">
                Acesso rápido por perfil:
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin', 'admin')}
                  className="w-full sm:w-auto text-[11px] font-semibold text-red-900 dark:text-red-300 bg-white dark:bg-slate-900/50 hover:bg-red-50 dark:hover:bg-red-950/50 active:bg-red-100 dark:active:bg-red-900 border border-gray-200 dark:border-slate-600 hover:border-red-200 dark:hover:border-red-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer hover:border-gray-300 dark:hover:border-slate-500 active:bg-gray-100 dark:active:bg-slate-600"
                  title="Acessa como Administrador (Gestão, Aceitar chamados, Concluídos e Análises)"
                >
                  admin / admin (Admin TI)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('usuario', 'usuario')}
                  className="w-full sm:w-auto text-[11px] font-semibold text-blue-900 dark:text-sky-300 bg-white dark:bg-slate-900/50 hover:bg-blue-50 dark:hover:bg-sky-950/50 active:bg-blue-100 dark:active:bg-sky-900 border border-gray-200 dark:border-slate-600 hover:border-blue-200 dark:hover:border-sky-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer hover:border-gray-300 dark:hover:border-slate-500 active:bg-gray-100 dark:active:bg-slate-600"
                  title="Acessa como Usuário Padrão (Abrir e acompanhar Meus Chamados)"
                >
                  usuario / usuario (Padrão)
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

