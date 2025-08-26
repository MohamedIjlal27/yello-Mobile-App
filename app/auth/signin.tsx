import { View, Text, StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView, Platform, Keyboard, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { router } from 'expo-router';
import ArrowRight from '../../assets/icons/ArrowRight';
import CustomTextInput from '../../components/ui/CustomTextInput';
import CustomButton from '../../components/ui/CustomButton';
import CustomCheckbox from '../../components/ui/CustomCheckbox';
import { useBiometrics } from '../../hooks/useBiometrics';
import BiometricEnrollModal from '../../components/modals/BiometricEnrollModal';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthenticated, AUTH_KEYS } from '../../utils/authStorage';
import { demoLoginResponse, demoResponses, LoginResponse } from '../../utils/demoData';
import { useDispatch } from 'react-redux';
import { setUserId, setUserData } from '../../store/userSlice';
import { AppDispatch } from '../../store/store';
import styles from '../styles/auth/styles';
import { saveUserData, clearUserData, initDatabase } from '../../store/database';

// Add error handling utilities
const getErrorMessage = (error: any): string => {
  if (error?.result?.message) {
    return error.result.message;
  }
  
  if (error instanceof Error) {
    switch (error.message) {
      case 'Network request failed':
        return 'Unable to connect to server. Please check your internet connection.';
      case 'Invalid credentials':
        return 'Invalid username or password. Please try again.';
      case 'Server error occurred':
        return 'Server is down. Please try again later.';
      default:
        return error.message;

    }
  }
  
  return 'An unexpected error occurred. Please try again.';
};

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginResponse, setLoginResponse] = useState<LoginResponse | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const { 
    isBiometricSupported, 
    isFirstLogin, 
    enableBiometric, 
    authenticateWithBiometric,
    clearBiometricData 
  } = useBiometrics();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDatabase(); // Initialize the database first
        await checkAuth();
        await loadRememberedUsername();
        await checkBiometricStatus();
        await initializeUserData();
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initialize();
  }, []);

  const checkAuth = async () => {
    try {
      const isAuth = await AsyncStorage.getItem(AUTH_KEYS.IS_AUTHENTICATED);
      const rememberMe = await AsyncStorage.getItem('rememberMe');
      
      if (isAuth === 'true' && rememberMe === 'true') {
        router.replace('/home/HomeScreen');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    }
  };

  const loadRememberedUsername = async () => {
    const savedUsername = await AsyncStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  };

  const checkBiometricStatus = async () => {
    const biometricEnabled = await AsyncStorage.getItem('biometricEnabled');
    setIsBiometricEnabled(biometricEnabled === 'true');
  };

  const initializeUserData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('USER_ID');
      const userData = await AsyncStorage.getItem('USER_DATA');

      if (storedUserId) {
        dispatch(setUserId(storedUserId));
      }
      
      if (userData) {
        const parsedData = JSON.parse(userData);
        dispatch(setUserData({
          emp_id: parsedData.emp_id,
          emp_name: parsedData.emp_name,
          job_title: parsedData.job_title,
          profile_pic: parsedData.profile_pic,
          sales_id: parsedData.sales_id,
          sales_name: parsedData.sales_name
        }));
      }
    } catch (error) {
      console.error('Error initializing user data:', error);
    }
  };

  const handleLogin = async () => {
    // Input validation
    if (!username.trim()) {
      Alert.alert('Input Error', 'Please enter your username');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Input Error', 'Please enter your password');
      return;
    }

    try {
      setIsLoading(true);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Demo login - accept any username/password combination
      console.log('[DEMO LOGIN] Logging in with:', username);
      
      const response = demoLoginResponse;
      setLoginResponse(response);

      if (response.result && response.result.message?.toLowerCase().includes('success')) {
        const userId = response.result.sales_id || '';
        
        // Store complete user data in AsyncStorage
        const userDataToStore = {
          userId: userId.toString(),
          username,
          email: username,
          role: response.result.role || 'Cash Collector',
          profile_pic: response.result.profile_pic,
          emp_id: response.result.emp_id,
          emp_name: response.result.emp_name,
          job_title: response.result.job_title,
          sales_id: response.result.sales_id,
          sales_name: response.result.sales_name
        };

        // Save to SQLite database
        try {
          await saveUserData({
            emp_id: response.result.emp_id,
            emp_name: response.result.emp_name,
            job_title: response.result.job_title?.en_US || 'Sales Executive',
            profile_pic: response.result.profile_pic,
            sales_id: parseInt(response.result.sales_id) || 101,
            sales_name: response.result.sales_name
          });
        } catch (dbError) {
          console.error('Database save error:', dbError);
          // Show warning but continue with login
          Alert.alert(
            'Warning',
            'Your login was successful, but there was an issue saving some data locally. Some features may be limited.',
            [{ text: 'OK' }]
          );
        }

        try {
          await AsyncStorage.setItem('USER_DATA', JSON.stringify(userDataToStore));
          await AsyncStorage.setItem('USER_ID', userId.toString());
          await setAuthenticated(userDataToStore);
        } catch (storageError) {
          console.error('Storage error:', storageError);
          Alert.alert(
            'Warning',
            'Your login was successful, but there was an issue saving your session. You may need to login again next time.',
            [{ text: 'OK' }]
          );
        }
        
        // Update Redux state
        dispatch(setUserId(userId.toString()));
        dispatch(setUserData({
          emp_id: response.result.emp_id,
          emp_name: response.result.emp_name,
          job_title: response.result.job_title,
          profile_pic: response.result.profile_pic,
          sales_id: parseInt(response.result.sales_id) || 101,
          sales_name: response.result.sales_name
        }));
        
        await handleRememberMe();

        if (isBiometricSupported) {
          const biometricEnabled = await AsyncStorage.getItem('biometricEnabled');
          
          if (biometricEnabled !== 'true') {
            setShowBiometricPrompt(true);
            return;
          }
        }

        router.replace('/home/HomeScreen');
      } else {
        const errorMessage = response.result?.message || 'Invalid username or password';
        Alert.alert('Login Failed', errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = getErrorMessage(error);
      Alert.alert('Login Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRememberMe = async () => {
    if (rememberMe) {
      await AsyncStorage.setItem('rememberedUsername', username);
      await AsyncStorage.setItem('rememberMe', 'true');
    } else {
      await AsyncStorage.removeItem('rememberedUsername');
      await AsyncStorage.setItem('rememberMe', 'false');
    }
  };

  const handleEnableBiometric = async () => {
    try {
      console.log('Attempting to enable biometrics...');
      const success = await enableBiometric();
      
      if (success) {
        console.log('Biometric enrollment successful');
        await AsyncStorage.setItem('biometricEnabled', 'true');
        await AsyncStorage.setItem('biometricUsername', username);
        
        Alert.alert(
          'Success',
          'Fingerprint login has been enabled successfully! You can now use your fingerprint to login next time.'
        );
      } else {
        console.log('Biometric enrollment failed');
        Alert.alert(
          'Biometric Setup Failed',
          'Could not enable fingerprint login. Please make sure your device has fingerprint security set up and try again in profile settings.'
        );
      }
      
      setShowBiometricPrompt(false);
      router.replace('/home/HomeScreen');
    } catch (error) {
      console.error('Error enabling biometric:', error);
      Alert.alert(
        'Biometric Setup Error',
        'There was a problem setting up fingerprint login. Please try again later in profile settings.'
      );
      setShowBiometricPrompt(false);
      router.replace('/home/HomeScreen');
    }
  };

  const handleSkipBiometric = async () => {
    console.log('User skipped biometric enrollment');
    setShowBiometricPrompt(false);
    router.replace('/home/HomeScreen');
  };

  const handleBiometricLogin = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem('biometricUsername');
      if (!savedUsername) {
        Alert.alert(
          'Biometric Login Error',
          'No saved credentials found. Please login with your username and password first.'
        );
        return;
      }

      const authenticated = await authenticateWithBiometric();
      if (authenticated) {
        setUsername(savedUsername);
        await handleLogin();
      }
    } catch (error) {
      console.error('Biometric login error:', error);
      Alert.alert(
        'Biometric Login Failed',
        'Could not verify your fingerprint. Please try again or use your username and password.'
      );
    }
  };

  const handleFocus = (offset: number) => {
    scrollViewRef.current?.scrollTo({ y: offset, animated: true });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/yello_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <KeyboardAvoidingView 
        style={styles.formSection}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>Please Enter Credentials</Text>

            <CustomTextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              onFocus={() => handleFocus(100)}
            />

            <CustomTextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              isPassword
              onFocus={() => handleFocus(200)}
            />

            <CustomCheckbox
              label="Remember Me"
              value={rememberMe}
              onValueChange={(value) => setRememberMe(value)}
            />

            <CustomButton 
              onPress={() => {
                Keyboard.dismiss();
                handleLogin();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <ArrowRight width={22} height={22} fill="#FF0000FF" />
              )}
            </CustomButton>

            {isBiometricSupported && isBiometricEnabled && (
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricLogin}
              >
                <Ionicons name="finger-print" size={24} color="#007AFF" />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BiometricEnrollModal
        visible={showBiometricPrompt}
        onClose={() => setShowBiometricPrompt(false)}
        onEnableBiometric={handleEnableBiometric}
        onSkipBiometric={handleSkipBiometric}
      />
    </View>
  );
}
