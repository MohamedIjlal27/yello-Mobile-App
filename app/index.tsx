import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { isAuthenticated, getUserData } from '../utils/authStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RedirectPath = '/auth/signin' | '/auth/biometric' | '/home/HomeScreen';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState<RedirectPath>('/auth/signin');

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const biometricEnabled = await AsyncStorage.getItem('biometricEnabled');
        const isAuth = await AsyncStorage.getItem('isAuthenticated');
        const rememberMe = await AsyncStorage.getItem('rememberMe');

        // If biometric is enabled, always go to biometric login
        if (biometricEnabled === 'true') {
          setRedirectPath('/auth/biometric');
          setIsLoading(false);
          return;
        }

        // Only check remember me if biometric is not enabled
        if (isAuth === 'true' && rememberMe === 'true') {
          setRedirectPath('/home/HomeScreen');
        } else {
          setRedirectPath('/auth/signin');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setRedirectPath('/auth/signin');
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

  return <Redirect href={redirectPath} />;
} 