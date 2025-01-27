import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import SplashScreenComponent from '../components/SplashScreen';
import { View, useColorScheme, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import Toast, { BaseToast, ErrorToast, ToastProps } from 'react-native-toast-message';

// Toast configuration
const toastConfig = {
  success: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#10B981' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 17,
        fontWeight: '600'
      }}
      text2Style={{
        fontSize: 16
      }}
    />
  ),
  error: (props: ToastProps) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#EF4444' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 17,
        fontWeight: '600'
      }}
      text2Style={{
        fontSize: 16
      }}
    />
  )
};

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Hide splash screen after a delay
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay
      setShowSplash(false);
    };
    
    hideSplash();
  }, []);

  if (showSplash) {
    return (
      <>
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={colorScheme === 'dark' ? '#000000' : '#FFFFFF'}
          translucent
        />
        <SplashScreenComponent />
      </>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colorScheme === 'dark' ? '#000000' : '#FFFFFF'}
        translucent
      />
      <Provider store={store}>
        <Stack screenOptions={{
          headerShown: false,
        }} />
      </Provider>
      <Toast config={toastConfig} />
    </>
  );
}
