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
            return JSON.parse(userData);
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
            // Update AsyncStorage with all current state data
            AsyncStorage.setItem('USER_DATA', JSON.stringify({
                ...state,
                userId: action.payload
            })).catch(error => console.error('Error saving user data:', error));
        },
        setOrderId: (state, action: PayloadAction<string>) => {
            state.orderId = action.payload;
            // Update AsyncStorage with all current state data
            AsyncStorage.setItem('USER_DATA', JSON.stringify({
                ...state,
                orderId: action.payload
            })).catch(error => console.error('Error saving user data:', error));
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
            
            // Store the complete user data including the current userId and orderId
            const userData = {
                userId: state.userId,
                orderId: state.orderId,
                empId: action.payload.emp_id,
                empName: action.payload.emp_name,
                jobTitle: action.payload.job_title,
                profilePic: action.payload.profile_pic,
                salesId: action.payload.sales_id,
                salesName: action.payload.sales_name
            };
            
            // Store the complete user data
            AsyncStorage.setItem('USER_DATA', JSON.stringify(userData))
                .catch(error => console.error('Error saving user data:', error));
        },
        clearUserData: (state) => {
            // Clear AsyncStorage when logging out
            AsyncStorage.removeItem('USER_DATA')
                .catch(error => console.error('Error clearing user data:', error));
            return initialState;
        }
    }
});

export const { setUserId, setOrderId, setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;