import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface JobTitle {
    en_US: string;
}

interface UserState {
    userId: string;
    orderId: string;
    empId: number | null;
    empName: string;
    jobTitle: JobTitle | null;
    profilePic: string | null;
    salesId: number | null;
    salesName: string;
}

const initialState: UserState = {
    userId: '',
    orderId: '',
    empId: null,
    empName: '',
    jobTitle: null,
    profilePic: null,
    salesId: null,
    salesName: ''
};

// Create an async thunk to initialize the state
export const initializeUserState = async () => {
    try {
        const userData = await AsyncStorage.getItem('USER_DATA');
        if (userData) {
            const parsedData = JSON.parse(userData);
            return {
                userId: parsedData.user_id || '',
                orderId: parsedData.order_id || '',
                empId: parsedData.emp_id || null,
                empName: parsedData.emp_name || '',
                jobTitle: parsedData.job_title || null,
                profilePic: parsedData.profile_pic || null,
                salesId: parsedData.sales_id || null,
                salesName: parsedData.sales_name || ''
            };
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
        setUserData: (state, action: PayloadAction<{
            emp_id: number;
            emp_name: string;
            job_title: JobTitle;
            profile_pic: string | null;
            sales_id: number;
            sales_name: string;
        }>) => {
            state.empId = action.payload.emp_id;
            state.empName = action.payload.emp_name;
            state.jobTitle = action.payload.job_title;
            state.profilePic = action.payload.profile_pic;
            state.salesId = action.payload.sales_id;
            state.salesName = action.payload.sales_name;
        },
        clearUserData: (state) => {
            return initialState;
        }
    }
});

export const { setUserId, setOrderId, setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;