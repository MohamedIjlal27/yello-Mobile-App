import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import SplashScreenComponent from '../components/SplashScreen';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from '../store/store';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

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
    return <SplashScreenComponent />;
  }

  return (
    <Provider store={store}>
      <Stack screenOptions={{
        headerShown: false,
      }} />
    </Provider>
  );
}
