import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { isAuthenticated, getUserData } from '../utils/authStorage';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const authStatus = await isAuthenticated();
      setIsAuth(authStatus);
      setIsLoading(false);
    };
    initialize();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  return <Redirect href={isAuth ? "/home/HomeScreen" : "/auth/signin"} />;
} 