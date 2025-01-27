import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
    userId: string;
    orderId: string;
}

const initialState: UserState = {
    userId: '',
    orderId: ''
};

// Create an async thunk to initialize the state
export const initializeUserState = async () => {
    try {
        const userData = await AsyncStorage.getItem('USER_DATA');
        if (userData) {
            const parsedData = JSON.parse(userData);
            return { userId: parsedData.user_id || '', orderId: parsedData.order_id || '' };
        }
    } catch (error) {
        console.error('Error loading user state:', error);
    }
    return initialState;
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserId: (state, action: PayloadAction<string>) => {
            state.userId = action.payload;
            // Persist to AsyncStorage
            AsyncStorage.setItem('USER_DATA', JSON.stringify({ user_id: action.payload }))
                .catch(error => console.error('Error saving user ID:', error));
        },
        setOrderId: (state, action: PayloadAction<string>) => {
            state.orderId = action.payload;
        },
        clearUserId: (state) => {
            state.userId = '';
            state.orderId = '';
            // Clear from AsyncStorage
            AsyncStorage.removeItem('USER_DATA')
                .catch(error => console.error('Error clearing user ID:', error));
        }
    }
});

export const { setUserId, setOrderId, clearUserId } = userSlice.actions;
export default userSlice.reducer;