import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import CustomTextInput from '../../components/ui/CustomTextInput';
import { changePassword } from '../../api/endpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const empId = useSelector((state: RootState) => state.user.empId);

  const validatePassword = (password: string): boolean => {
    // At least 8 characters, containing letters and numbers
    return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  };

  const handleChangePassword = async () => {
    try {
      // Validate inputs
      if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'New passwords do not match');
        return;
      }

      if (!validatePassword(newPassword)) {
        Alert.alert(
          'Invalid Password',
          'Password must be at least 8 characters long and contain both letters and numbers'
        );
        return;
      }

      if (!empId) {
        Alert.alert('Error', 'User ID not found');
        return;
      }

      setIsLoading(true);

      const response = await changePassword({
        userId: empId.toString(),
        isTemp: "FALSE",
        password: newPassword
      });

      if (response.result.message) {
        Alert.alert(
          'Success',
          'Password changed successfully. Please login again with your new password.',
          [
            {
              text: 'OK',
              onPress: async () => {
                await AsyncStorage.multiRemove([
                  'biometricEnabled',
                  'biometricUsername',
                  'rememberedUsername',
                  'rememberMe'
                ]);
                router.replace('/auth/signin');
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Change password error:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to change password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Change Password</Text>
          
          <CustomTextInput
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            isPassword
          />

          <CustomTextInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            isPassword
          />

          <CustomTextInput
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            isPassword
          />

          <Text style={styles.hint}>
            Password must be at least 8 characters long and contain both letters and numbers
          </Text>

          <TouchableOpacity 
            onPress={handleChangePassword}
            disabled={isLoading}
            style={[styles.button, isLoading && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
}); 