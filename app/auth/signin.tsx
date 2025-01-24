import { View, Text, StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView, Platform, Keyboard, TouchableOpacity } from 'react-native';
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

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { 
    isBiometricSupported, 
    isFirstLogin, 
    enableBiometric, 
    authenticateWithBiometric,
    clearBiometricData 
  } = useBiometrics();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await AsyncStorage.getItem(AUTH_KEYS.IS_AUTHENTICATED);
        const rememberMe = await AsyncStorage.getItem('rememberMe');
        
        // Only auto-login if both authenticated and remember me is true
        if (isAuth === 'true' && rememberMe === 'true') {
          router.replace('/home/HomeScreen');
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const loadRememberedUsername = async () => {
      const savedUsername = await AsyncStorage.getItem('rememberedUsername');
      if (savedUsername) {
        setUsername(savedUsername);
        setRememberMe(true);
      }
    };
    loadRememberedUsername();
  }, []);

  useEffect(() => {
    // Check if biometrics are enabled
    const checkBiometricStatus = async () => {
      const biometricEnabled = await AsyncStorage.getItem('biometricEnabled');
      setIsBiometricEnabled(biometricEnabled === 'true');
    };
    checkBiometricStatus();
  }, []);

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        Alert.alert('Error', 'Please enter both username and password');
        return;
      }

      // Here you would typically validate credentials with your backend
      const loginSuccess = true; // Replace with actual login validation

      if (loginSuccess) {
        const userData = {
          username: username,
          role: 'Cash Collector', // This should come from your backend
        };

        // Save authentication state
        await setAuthenticated(userData);
        
        // Handle remember me
        await AsyncStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');
        if (rememberMe) {
          await AsyncStorage.setItem('rememberedUsername', username);
        } else {
          await AsyncStorage.removeItem('rememberedUsername');
        }

        // Check biometric status
        if (isBiometricSupported) {
          const biometricEnabled = await AsyncStorage.getItem('biometricEnabled');
          if (!biometricEnabled) {
            setShowBiometricPrompt(true);
            return; // Don't navigate yet, wait for biometric setup decision
          }
        }
        
        // Only navigate to home if we're not showing biometric prompt
        router.replace('/home/HomeScreen');
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login');
    }
  };

  const handleEnableBiometric = async () => {
    try {
      const success = await enableBiometric();
      await AsyncStorage.setItem('hasLoggedIn', 'true');
      
      if (success) {
        // Store the username for biometric login
        await AsyncStorage.setItem('biometricUsername', username);
        
        Alert.alert(
          'Success',
          'Biometric login has been enabled successfully!'
        );
        // Save the current user data for biometric login
        const userData = {
          username: username,
          role: 'Cash Collector',
        };
        await setAuthenticated(userData);
      } else {
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

  const handleBiometricLogin = async () => {
    try {
      // First check if biometrics are enabled
      const biometricEnabled = await AsyncStorage.getItem('biometricEnabled');
      if (!biometricEnabled) {
        Alert.alert(
          'Biometric Login Not Enabled',
          'Please enable biometric login in your profile settings first.'
        );
        return;
      }

      // Get the stored username for biometric login
      const storedUsername = await AsyncStorage.getItem('biometricUsername');
      if (!storedUsername) {
        Alert.alert(
          'Biometric Login Error',
          'No stored credentials found. Please login with username and password first.'
        );
        return;
      }

      const success = await authenticateWithBiometric();
      if (success) {
        const userData = {
          username: storedUsername,
          role: 'Cash Collector',
        };
        await setAuthenticated(userData);
        router.replace('/home/HomeScreen');
      }
    } catch (error) {
      console.error('Error during biometric login:', error);
      Alert.alert(
        'Authentication Failed',
        'Could not authenticate with fingerprint. Please try again or use your credentials.'
      );
    }
  };

  const handleSkipBiometric = () => {
    // Just navigate to home page when user skips biometric setup
    router.replace('/home/HomeScreen');
  };

  const handleFocus = (y: number) => {
    scrollViewRef.current?.scrollTo({
      y,
      animated: true,
    });
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
            >
              <ArrowRight width={22} height={22} fill="#FF0000" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    backgroundColor: '#FF0000',
    padding: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 316,
    zIndex: 1,
  },
  logo: {
    width: '60%',
    height: 120,
  },
  formSection: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 24,
    paddingTop: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '800',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: '#000',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkbox: {
    marginRight: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#666',
  },
  rememberText: {
    fontSize: 16,
    color: '#000000FF',
    fontWeight: '500',
  },
  signInButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 40,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  biometricButton: {
    alignSelf: 'center',
    padding: 15,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    marginTop: 20,
  },
}); 