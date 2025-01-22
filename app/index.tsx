import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { initializeAuth } from '../store/slices/authSlice';

export default function Index() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, userData } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      await dispatch(initializeAuth());
      setIsLoading(false);
    };
    initialize();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? "/home/HomeScreen" : "/auth/signin"} />;
} 