import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useBiometrics = () => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
    checkFirstLogin();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(compatible);
  };

  const checkFirstLogin = async () => {
    try {
      const hasLoggedIn = await AsyncStorage.getItem('hasLoggedIn');
      setIsFirstLogin(!hasLoggedIn);
      if (!hasLoggedIn) {
        await AsyncStorage.setItem('hasLoggedIn', 'true');
      }
    } catch (error) {
      console.error('Error checking first login:', error);
    }
  };

  const enableBiometric = async () => {
    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Scan your fingerprint to enable biometric login',
        disableDeviceFallback: true,
      });

      if (biometricAuth.success) {
        await AsyncStorage.setItem('biometricEnabled', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error enabling biometric:', error);
      return false;
    }
  };

  const authenticateWithBiometric = async () => {
    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Scan your fingerprint to login',
        disableDeviceFallback: true,
      });
      return biometricAuth.success;
    } catch (error) {
      console.error('Error authenticating with biometric:', error);
      return false;
    }
  };

  const clearBiometricData = async () => {
    try {
      // Clear biometric related data from AsyncStorage
      await AsyncStorage.multiRemove([
        'biometricEnabled',
        'hasLoggedIn'
      ]);
      
      // If you have any active biometric enrollment, clear it
      if (await LocalAuthentication.isEnrolledAsync()) {
        // Note: We can't programmatically remove fingerprints, 
        // but we can disable our app's access to them
        await LocalAuthentication.cancelAuthenticate();
      }
      
      return true;
    } catch (error) {
      console.error('Error clearing biometric data:', error);
      return false;
    }
  };

  return {
    isBiometricSupported,
    isFirstLogin,
    enableBiometric,
    authenticateWithBiometric,
    clearBiometricData,
  };
}; 