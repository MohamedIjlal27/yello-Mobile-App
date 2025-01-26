import { configureStore } from '@reduxjs/toolkit';
import userReducer, { initializeUserState } from './userSlice';

// Initialize store with empty state
export const store = configureStore({
    reducer: {
        user: userReducer
    }
});

// Load persisted state
initializeUserState().then(initialState => {
    if (initialState.userId) {
        store.dispatch({ type: 'user/setUserId', payload: initialState.userId });
    }
}).catch(error => {
    console.error('Error initializing store:', error);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;