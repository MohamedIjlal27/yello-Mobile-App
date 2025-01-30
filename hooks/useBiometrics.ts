import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import { enrollBiometric } from '../api/endpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const useBiometrics = () => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const empId = useSelector((state: RootState) => state.user.empId);

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
      if (!empId) {
        throw new Error('Employee ID not found');
      }

      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Scan your fingerprint to enable biometric login',
        disableDeviceFallback: true,
      });

      if (biometricAuth.success) {
        // Generate a unique biometric hash using timestamp and device info
        const timestamp = new Date().getTime();
        const deviceInfo = await Device.getDeviceTypeAsync();
        const biometricHash = `${timestamp}-${deviceInfo}-${empId}`;
        
        // Call the API to enroll biometric
        const response = await enrollBiometric({
          userId: empId.toString(),
          biometricHash: biometricHash
        });

        if (response.result.message === 'Biometric hash updated successfully') {
          await AsyncStorage.setItem('biometricEnabled', 'true');
          await AsyncStorage.setItem('biometricHash', biometricHash);
          return true;
        }
        return false;
      }
      return false;
    } catch (error) {
      console.error('Error enabling biometric:', error);
      return false;
    }
  };

  const authenticateWithBiometric = async () => {
    try {
      // Check if biometrics are enrolled
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        console.error('No biometrics enrolled on this device');
        return false;
      }

      // Check if biometrics are enabled for the app
      const biometricEnabled = await AsyncStorage.getItem('biometricEnabled');
      if (!biometricEnabled) {
        console.error('Biometrics not enabled for this app');
        return false;
      }

      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Scan your fingerprint to login',
        disableDeviceFallback: true,
        fallbackLabel: 'Use password instead'
      });

      return biometricAuth.success;
    } catch (error) {
      console.error('Error authenticating with biometric:', error);
      return false;
    }
  };

  const clearBiometricData = async (preserveBiometric: boolean = false) => {
    try {
      // If preserveBiometric is true, only clear session-related data
      if (preserveBiometric) {
        await AsyncStorage.multiRemove([
          'rememberedUsername',
          'hasLoggedIn'
        ]);
      } else {
        // Clear all biometric and authentication related data
        await AsyncStorage.multiRemove([
          'biometricEnabled',
          'biometricUsername',
          'hasLoggedIn',
          'rememberedUsername'
        ]);
        
        // If you have any active biometric enrollment, clear it
        if (await LocalAuthentication.isEnrolledAsync()) {
          await LocalAuthentication.cancelAuthenticate();
        }
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