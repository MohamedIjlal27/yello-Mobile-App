import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { isAuthenticated } from '../utils/authStorage';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const authState = await isAuthenticated();
    setIsAuth(authState);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  return <Redirect href={isAuth ? "/home/HomeScreen" : "/auth/Signin"} />;
} 