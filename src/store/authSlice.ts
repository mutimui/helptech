import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/index.ts';

interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  error: string | null;
  rememberMe: boolean;
}

const HARDCODED_USERS: Record<string, { password: string; user: User }> = {
  admin: {
    password: 'admin',
    user: {
      username: 'admin',
      name: 'Administrador',
      role: 'admin',
    },
  },
  usuario: {
    password: 'usuario',
    user: {
      username: 'usuario',
      name: 'Usuário',
      role: 'usuario',
    },
  },
};

// Helper to load persisted auth state from localStorage
const loadPersistedAuth = (): AuthState => {
  try {
    const raw = localStorage.getItem('helptec_auth');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.currentUser && parsed.isAuthenticated) {
        return {
          isAuthenticated: true,
          currentUser: parsed.currentUser,
          error: null,
          rememberMe: parsed.rememberMe ?? true,
        };
      }
    }
  } catch (err) {
    console.warn('Erro ao carregar sessão persistida:', err);
  }

  return {
    isAuthenticated: false,
    currentUser: null,
    error: null,
    rememberMe: false,
  };
};

const initialState: AuthState = loadPersistedAuth();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ username: string; password: string; rememberMe?: boolean }>
    ) => {
      const { username, password, rememberMe } = action.payload;
      const lowerUser = username.trim().toLowerCase();
      const account = HARDCODED_USERS[lowerUser];

      if (account && account.password === password) {
        state.isAuthenticated = true;
        state.currentUser = account.user;
        state.error = null;
        state.rememberMe = !!rememberMe;

        try {
          localStorage.setItem(
            'helptec_auth',
            JSON.stringify({
              isAuthenticated: true,
              currentUser: account.user,
              rememberMe: !!rememberMe,
            })
          );
        } catch (err) {
          console.warn('Erro ao salvar autenticação no localStorage:', err);
        }
      } else {
        state.isAuthenticated = false;
        state.currentUser = null;
        state.error = 'Usuário ou senha inválidos. Tente admin/admin ou usuario/usuario.';
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.error = null;

      try {
        localStorage.removeItem('helptec_auth');
      } catch (err) {
        console.warn('Erro ao remover autenticação do localStorage:', err);
      }
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const { login, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
