import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBiometrics } from '../../hooks/useBiometrics';
import { setAuthenticated } from '../../utils/authStorage';
import ArrowRight from '../../assets/icons/ArrowRight';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';



export default function BiometricLogin() {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { authenticateWithBiometric, enableBiometric, isFirstLogin } = useBiometrics();
  const userId = useSelector((state: RootState) => state.user.userId);

  useEffect(() => {
    // Load the stored username
    const loadUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('biometricUsername');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };
    loadUsername();
  }, []);

  const handlePasswordLogin = async () => {
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    // Here you would validate the password with your backend
    const loginSuccess = true; // Replace with actual validation

    if (loginSuccess) {
      const userData = {
        username: username,
        role: 'Cash Collector',
        userId: userId // This should come from your login response
      };
      
      // If this is first login, enable biometric
      if (isFirstLogin) {
        const biometricEnabled = await enableBiometric();
        if (!biometricEnabled) {
          Alert.alert('Warning', 'Failed to enable biometric login. You can try again later in settings.');
        }
      }
      
      await setAuthenticated(userData);
      router.replace('/home/HomeScreen');
    } else {
      Alert.alert('Error', 'Invalid password');
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const success = await authenticateWithBiometric();
      if (success) {
        const userData = {
          username: username,
          role: 'Cash Collector',
        };
        await setAuthenticated(userData);
        router.replace('/home/HomeScreen');
      }
    } catch (error) {
      console.error('Error during biometric login:', error);
      Alert.alert(
        'Authentication Failed',
        'Could not authenticate with fingerprint. Please try again or use your password.'
      );
    }
  };

  const handleChangeUser = () => {
    Alert.alert(
      'Change User',
      'This will erase your current credentials and biometric settings. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Change User',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all biometric and authentication data
              await AsyncStorage.multiRemove([
                'biometricEnabled',
                'biometricUsername',
                'rememberMe',
                'rememberedUsername',
                'hasLoggedIn',
                'isAuthenticated'
              ]);
              router.replace('/auth/signin');
            } catch (error) {
              console.error('Error clearing user data:', error);
              Alert.alert('Error', 'Failed to change user. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/yello_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Form Section */}
      <View style={styles.formSection}>
        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>
            Hi, Welcome Back,{'\n'}
            <Text style={styles.username}>{username}! 👋</Text>
          </Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, showPassword ? null : styles.passwordInput]}
                placeholder="Enter password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#666"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handlePasswordLogin}
            >
              <ArrowRight width={22} height={22} fill="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.biometricButton}
              onPress={handleBiometricLogin}
            >
              <Ionicons name="finger-print" size={32} color="#000" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.changeUserButton}
            onPress={handleChangeUser}
          >
            <Text style={styles.changeUserText}>Change User</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  formContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 40,
    color: '#000',
    fontWeight: '500',
  },
  username: {
    fontWeight: 'bold',
  },
  inputWrapper: {
    width: '100%',
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
    position: 'relative',
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: '#000',
    width: '100%',
    height: 56,
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 40,
  },
  signInButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#F5F5F5',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeUserButton: {
    backgroundColor: '#C3C3C3',
    width: 289,
    height: 44,
    borderRadius: 10,
    marginTop: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeUserText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
}); 