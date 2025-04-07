import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import reducers
// We'll add these as we create them
// import authReducer from './features/auth/authSlice';
import casesReducer from './features/cases/casesSlice';
// import clientsReducer from './features/clients/clientsSlice';
// import settingsReducer from './features/settings/settingsSlice';

/**
 * Configure the Redux store
 */
export const store = configureStore({
  reducer: {
    // Add reducers as we create them
    // auth: authReducer,
    cases: casesReducer,
    // clients: clientsReducer,
    // settings: settingsReducer,
  },
  // Add middleware if needed
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['your/action/type'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
