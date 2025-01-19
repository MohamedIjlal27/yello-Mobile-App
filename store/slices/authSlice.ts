import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_KEYS } from '../../utils/authStorage';

interface UserData {
  username: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  userData: UserData | null;
  isBiometricEnabled: boolean;
  rememberMe: boolean;
  rememberedUsername: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userData: null,
  isBiometricEnabled: false,
  rememberMe: false,
  rememberedUsername: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUserData: (state, action: PayloadAction<UserData | null>) => {
      state.userData = action.payload;
    },
    setBiometricEnabled: (state, action: PayloadAction<boolean>) => {
      state.isBiometricEnabled = action.payload;
    },
    setRememberMe: (state, action: PayloadAction<boolean>) => {
      state.rememberMe = action.payload;
    },
    setRememberedUsername: (state, action: PayloadAction<string | null>) => {
      state.rememberedUsername = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
      // Note: We don't clear biometric and remember me settings on logout
    },
  },
});

// Thunks
export const initializeAuth = () => async (dispatch: any) => {
  try {
    const authState = await AsyncStorage.getItem(AUTH_KEYS.IS_AUTHENTICATED);
    const userDataStr = await AsyncStorage.getItem(AUTH_KEYS.USER_DATA);
    const biometricEnabled = await AsyncStorage.getItem('biometricEnabled');
    const rememberedUsername = await AsyncStorage.getItem('rememberedUsername');

    dispatch(setAuthState(authState === 'true'));
    dispatch(setUserData(userDataStr ? JSON.parse(userDataStr) : null));
    dispatch(setBiometricEnabled(!!biometricEnabled));
    dispatch(setRememberedUsername(rememberedUsername));
  } catch (error) {
    console.error('Error initializing auth state:', error);
  }
};

export const loginUser = (userData: UserData, rememberMe: boolean) => async (dispatch: any) => {
  try {
    await AsyncStorage.setItem(AUTH_KEYS.IS_AUTHENTICATED, 'true');
    await AsyncStorage.setItem(AUTH_KEYS.USER_DATA, JSON.stringify(userData));
    
    if (rememberMe) {
      await AsyncStorage.setItem('rememberedUsername', userData.username);
    }

    dispatch(setAuthState(true));
    dispatch(setUserData(userData));
    dispatch(setRememberMe(rememberMe));
    if (rememberMe) {
      dispatch(setRememberedUsername(userData.username));
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const logoutUser = () => async (dispatch: any) => {
  try {
    await AsyncStorage.removeItem(AUTH_KEYS.IS_AUTHENTICATED);
    await AsyncStorage.removeItem(AUTH_KEYS.USER_DATA);
    dispatch(logout());
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

export const {
  setAuthState,
  setUserData,
  setBiometricEnabled,
  setRememberMe,
  setRememberedUsername,
  logout,
} = authSlice.actions;

export default authSlice.reducer; 