import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserId, setUserData } from '../store/userSlice';
import { AUTH_KEYS } from '../utils/authStorage';

export default function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if user is authenticated
      const isAuth = await AsyncStorage.getItem(AUTH_KEYS.IS_AUTHENTICATED);
      
      if (isAuth === 'true') {
        // Load user data from AsyncStorage
        const userData = await AsyncStorage.getItem('USER_DATA');
        if (userData) {
          const parsedData = JSON.parse(userData);
          
          // Set user ID
          if (parsedData.userId) {
            dispatch(setUserId(parsedData.userId));
          }
          
          // Set complete user data
          if (parsedData.empId) {
            dispatch(setUserData({
              emp_id: parsedData.empId,
              emp_name: parsedData.empName,
              job_title: parsedData.jobTitle,
              profile_pic: parsedData.profilePic,
              sales_id: parsedData.salesId,
              sales_name: parsedData.salesName
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  };

  return <>{children}</>;
} 