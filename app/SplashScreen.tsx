import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { isAuthenticated } from '../utils/authStorage';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  useEffect(() => {
    checkAuthAndNavigate();
  }, []);

  const checkAuthAndNavigate = async () => {
    try {
      // Add a minimum delay to show splash screen
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const isAuth = await isAuthenticated();
      
      if (isAuth) {
        router.replace('/home/HomeScreen');
      } else {
        router.replace('/auth/Signin');
      }
    } catch (error) {
      console.error('Error in splash screen:', error);
      router.replace('/auth/Signin');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/yello_logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
  },
}); 