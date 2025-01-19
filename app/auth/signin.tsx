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
import { setAuthenticated, isAuthenticated } from '../../utils/authStorage';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { 
    isBiometricSupported, 
    isFirstLogin, 
    enableBiometric, 
    authenticateWithBiometric,
    clearBiometricData 
  } = useBiometrics();
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    checkBiometricEnabled();
    
    // Add cleanup function
    return () => {
      handleCleanup();
    };
  }, []);

  const checkAuthStatus = async () => {
    const authState = await isAuthenticated();
    if (authState) {
      router.replace('/home/HomeScreen');
    }
  };

  const handleCleanup = async () => {
    try {
      // Check if app is being uninstalled or if we need to clear data
      const shouldClearData = await AsyncStorage.getItem('appUninstalling');
      if (shouldClearData === 'true') {
        await clearBiometricData();
        await AsyncStorage.removeItem('appUninstalling');
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  };

  const checkBiometricEnabled = async () => {
    try {
      const enabled = await AsyncStorage.getItem('biometricEnabled');
      setIsBiometricEnabled(!!enabled);
    } catch (error) {
      console.error('Error checking biometric status:', error);
    }
  };

  const handleLogin = async () => {
    const user = {
      username: username,
      password: password,
    }
    try {
      // Check if username and password are provided
      if (!user.username || !user.password) {
        Alert.alert('Error', 'Please enter both username and password');
        return;
      }

      // Here you would typically validate credentials with your backend
      // For now, we'll simulate a successful login
      const loginSuccess = true; // Replace with actual login validation

      if (loginSuccess) {
        // Set authenticated state
        await setAuthenticated({
          username: user.username,
          role: 'Cash Collector', // This should come from your backend
        });

        // Store credentials if remember me is checked
        if (rememberMe) {
          await AsyncStorage.setItem('rememberedUsername', username);
        }

        // Check if it's first login and device supports biometrics
        const hasLoggedIn = await AsyncStorage.getItem('hasLoggedIn');
        const biometricEnabled = await AsyncStorage.getItem('biometricEnabled');
        
        if (!hasLoggedIn && isBiometricSupported && !biometricEnabled) {
          // First time login, show biometric enrollment
          setShowBiometricPrompt(true);
        } else {
          // Not first login or biometrics already set up, proceed to home
          router.replace('/home/HomeScreen');
        }
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login');
    }
  };

  const handleEnableBiometric = async () => {
    const success = await enableBiometric();
    if (success) {
      // Set hasLoggedIn to true after successful biometric enrollment
      await AsyncStorage.setItem('hasLoggedIn', 'true');
      
      // Close the modal and navigate to home screen
      setShowBiometricPrompt(false);
      router.replace('/home/HomeScreen');
    } else {
      // If user declines biometric enrollment, still mark as logged in
      await AsyncStorage.setItem('hasLoggedIn', 'true');
      setShowBiometricPrompt(false);
      router.replace('/home/HomeScreen');
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const success = await authenticateWithBiometric();
      if (success) {
        // Get stored username if available
        const rememberedUsername = await AsyncStorage.getItem('rememberedUsername');
        if (rememberedUsername) {
          setUsername(rememberedUsername);
          // Set authenticated state
          await setAuthenticated({
            username: rememberedUsername,
            role: 'Cash Collector', // This should come from your backend
          });
        }
        // Navigate to home screen
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

  // Load remembered username on component mount
  useEffect(() => {
    const loadRememberedUsername = async () => {
      try {
        const rememberedUsername = await AsyncStorage.getItem('rememberedUsername');
        if (rememberedUsername) {
          setUsername(rememberedUsername);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error loading remembered username:', error);
      }
    };

    loadRememberedUsername();
  }, []);

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
              onValueChange={setRememberMe}
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