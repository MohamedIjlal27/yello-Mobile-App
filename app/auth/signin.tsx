import { View, Text, StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useState, useRef } from 'react';
import { router } from 'expo-router';
import ArrowRight from '../../assets/icons/ArrowRight';
import CustomTextInput from '../../components/ui/CustomTextInput';
import CustomButton from '../../components/ui/CustomButton';
import CustomCheckbox from '../../components/ui/CustomCheckbox';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSignIn = () => {
    router.push('/home/HomeScreen');
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
              onValueChange={setRememberMe}
            />

            <CustomButton 
              onPress={() => {
                Keyboard.dismiss();
                handleSignIn();
              }}
            >
              <ArrowRight width={22} height={22} fill="#FF0000" />
            </CustomButton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
}); 