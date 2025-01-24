import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { isAuthenticated, getUserData } from '../utils/authStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirectToAuth, setShouldRedirectToAuth] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const biometricEnabled = await AsyncStorage.getItem('biometricEnabled');
        const isAuth = await AsyncStorage.getItem('isAuthenticated');
        const rememberMe = await AsyncStorage.getItem('rememberMe');

        // Always redirect to login if biometric is enabled
        if (biometricEnabled === 'true') {
          await AsyncStorage.setItem('isAuthenticated', 'false'); // Force authentication state to false
          setShouldRedirectToAuth(true);
          setIsLoading(false);
          return;
        }

        // Only check remember me if biometric is not enabled
        if (isAuth === 'true' && rememberMe === 'true') {
          setShouldRedirectToAuth(false);
        } else {
          setShouldRedirectToAuth(true);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setShouldRedirectToAuth(true);
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  return <Redirect href={shouldRedirectToAuth ? "/auth/signin" : "/home/HomeScreen"} />;
} 