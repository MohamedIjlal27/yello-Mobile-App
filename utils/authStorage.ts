import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTH_KEYS = {
  IS_AUTHENTICATED: 'isAuthenticated',
  USER_DATA: 'userData',
};

export const setAuthenticated = async (userData: any) => {
  try {
    await AsyncStorage.setItem(AUTH_KEYS.IS_AUTHENTICATED, 'true');
    await AsyncStorage.setItem(AUTH_KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error('Error setting auth state:', error);
  }
};

export const clearAuthentication = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_KEYS.IS_AUTHENTICATED);
    await AsyncStorage.removeItem(AUTH_KEYS.USER_DATA);
  } catch (error) {
    console.error('Error clearing auth state:', error);
  }
};

export const isAuthenticated = async () => {
  try {
    const authState = await AsyncStorage.getItem(AUTH_KEYS.IS_AUTHENTICATED);
    return authState === 'true';
  } catch (error) {
    console.error('Error checking auth state:', error);
    return false;
  }
};

export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(AUTH_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}; 