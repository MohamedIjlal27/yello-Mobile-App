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
import { login, LoginResponse } from '../../api/endpoints';
import { useDispatch } from 'react-redux';
import { setUserId, setUserData } from '../../store/userSlice';
import { AppDispatch } from '../../store/store';
import styles from '../styles/auth/styles';

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
    checkAuth();
    loadRememberedUsername();
    checkBiometricStatus();
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

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    try {
      setIsLoading(true);

      const loginParams = {
        user_id: "",
        email: username,
        password: password,
        biometrics: ""
      };

      const response = await login(loginParams);
      setLoginResponse(response);

      if (response.result && response.result.message?.toLowerCase().includes('success')) {
        const userId = response.result.user_id || '';
        
        const userData = {
          username,
          email: username,
          role: response.result.role || 'Cash Collector',
          user_id: userId
        };

        await setAuthenticated(userData);
        
        dispatch(setUserId(userId));
        dispatch(setUserData({
          emp_id: response.result.emp_id,
          emp_name: response.result.emp_name,
          job_title: response.result.job_title,
          profile_pic: response.result.profile_pic,
          sales_id: response.result.sales_id,
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
        const errorMessage = response.result?.message || 'Login failed. Please check your credentials.';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login. Please check your internet connection and try again.');
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
      if (!loginResponse?.result.user_id) {
        throw new Error('User ID not found');
      }

      console.log('Attempting to enable biometrics...');
      const success = await enableBiometric(loginResponse.result.user_id);
      
      if (success) {
        console.log('Biometric enrollment successful');
        await AsyncStorage.setItem('biometricEnabled', 'true');
        await AsyncStorage.setItem('biometricUsername', username);
        
        Alert.alert(
          'Success',
          'Biometric login has been enabled successfully!'
        );
      } else {
        console.log('Biometric enrollment failed');
        Alert.alert(
          'Biometric Setup Failed',
          'Failed to enable biometric login. You can try enabling it later from the profile settings.'
        );
      }
      
      setShowBiometricPrompt(false);
      router.replace('/home/HomeScreen');
    } catch (error) {
      console.error('Error enabling biometric:', error);
      Alert.alert(
        'Error',
        'An error occurred while setting up biometric login. Please try again later.'
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
        throw new Error('No saved credentials found for biometric login');
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
        'Please try logging in with your username and password'
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
