import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActiveScreen } from '../types/index.ts';

interface NavigationState {
  currentScreen: ActiveScreen;
}

export const getAccessibleScreen = (screen: ActiveScreen, isAdmin: boolean): ActiveScreen =>
  isAdmin && (screen === 'abrir-chamado' || screen === 'meus-chamados')
    ? 'todos-chamados'
    : screen;

const loadPersistedScreen = (): ActiveScreen => {
  try {
    const authRaw = localStorage.getItem('helptec_auth');
    if (authRaw) {
      const auth = JSON.parse(authRaw);
      if (auth?.isAuthenticated) {
        const isAdmin = auth?.currentUser?.role === 'admin';
        const savedScreen = getAccessibleScreen(
          localStorage.getItem('helptec_screen') as ActiveScreen,
          isAdmin
        );
        const standardScreens = ['inicio', 'abrir-chamado', 'meus-chamados'];
        const adminScreens = [
          'inicio',
          'todos-chamados',
          'chamados-concluidos',
          'analises',
        ];
        const allowedScreens = isAdmin ? adminScreens : standardScreens;

        if (savedScreen && allowedScreens.includes(savedScreen)) {
          return savedScreen;
        }
        return 'inicio';
      }
    }
  } catch (err) {
    console.warn('Erro ao carregar tela persistida:', err);
  }
  return 'login';
};

const initialState: NavigationState = {
  currentScreen: loadPersistedScreen(),
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setScreen: (state, action: PayloadAction<ActiveScreen>) => {
      state.currentScreen = action.payload;
      try {
        localStorage.setItem('helptec_screen', action.payload);
      } catch (err) {
        console.warn('Erro ao persistir tela:', err);
      }
    },
  },
});

export const { setScreen } = navigationSlice.actions;
export default navigationSlice.reducer;
