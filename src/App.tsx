/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store, useAppDispatch, useAppSelector } from './store/index.ts';
import { getAccessibleScreen, setScreen } from './store/navigationSlice.ts';
import { LoginView } from './views/LoginView.tsx';
import { HomeView } from './views/HomeView.tsx';
import { CreateTicketView } from './views/CreateTicketView.tsx';
import { MyTicketsView } from './views/MyTicketsView.tsx';
import { AdminTicketsView } from './views/AdminTicketsView.tsx';
import { CompletedTicketsView } from './views/CompletedTicketsView.tsx';
import { AnalyticsView } from './views/AnalyticsView.tsx';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const requestedScreen = useAppSelector((state) => state.navigation.currentScreen);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const themeMode = useAppSelector((state) => state.theme.mode);
  const isAdmin = currentUser?.role === 'admin';
  const currentScreen = getAccessibleScreen(requestedScreen, isAdmin);

  useEffect(() => {
    if (currentScreen !== requestedScreen) {
      dispatch(setScreen(currentScreen));
    }
  }, [currentScreen, requestedScreen, dispatch]);

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  // If user is not logged in, enforce the Login view
  if (!isAuthenticated || currentScreen === 'login') {
    return <LoginView />;
  }

  // Se for usuario padrao e tentar acessar tela de admin, redireciona para meus-chamados
  if (
    !isAdmin &&
    ['todos-chamados', 'chamados-concluidos', 'analises'].includes(currentScreen)
  ) {
    return <MyTicketsView />;
  }

  // Authenticated Screen Router
  switch (currentScreen) {
    case 'inicio':
      return <HomeView />;
    case 'abrir-chamado':
      return <CreateTicketView />;
    case 'meus-chamados':
      return <MyTicketsView />;
    case 'todos-chamados':
      return isAdmin ? <AdminTicketsView /> : <MyTicketsView />;
    case 'chamados-concluidos':
      return isAdmin ? <CompletedTicketsView /> : <MyTicketsView />;
    case 'analises':
      return isAdmin ? <AnalyticsView /> : <HomeView />;
    default:
      return <HomeView />;
  }
};

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
