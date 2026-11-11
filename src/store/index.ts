import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './authSlice.ts';
import ticketReducer from './ticketSlice.ts';
import navigationReducer from './navigationSlice.ts';
import themeReducer from './themeSlice.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
    navigation: navigationReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
