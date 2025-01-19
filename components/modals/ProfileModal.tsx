import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  name: string;
  role: string;
}

const ProfileModal = ({ visible, onClose, name, role }: ProfileModalProps) => {
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);
  const [hasBiometricHardware, setHasBiometricHardware] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setHasBiometricHardware(compatible);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Profile Image and Status */}
            <View style={styles.profileImageContainer}>
              <Image
                source={require('../../assets/images/default-avatar.png')}
                style={styles.profileImage}
              />
              <View style={styles.statusIndicator} />
            </View>

            {/* Name and Role */}
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.role}>{role}</Text>

            {/* Language Icon */}
            <View style={styles.languageContainer}>
              <Image
                source={require('../../assets/images/language.png')}
                style={styles.languageIcon}
              />
            </View>

            {/* Enable Biometrics - Only show if device supports it */}
            {hasBiometricHardware && (
              <TouchableOpacity 
                style={styles.biometricsContainer}
                onPress={() => setIsBiometricsEnabled(!isBiometricsEnabled)}
              >
                <View style={styles.checkbox}>
                  {isBiometricsEnabled && (
                    <View style={styles.checkboxInner} />
                  )}
                </View>
                <Text style={styles.biometricsText}>Enable Biometrics</Text>
              </TouchableOpacity>
            )}

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton}>
              <Image
                source={require('../../assets/icons/logout.png')}
                style={styles.logoutIcon}
              />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxWidth: 320,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 24,
  },
  modalContent: {
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  statusIndicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    fontFamily: 'Inter',
  },
  role: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    fontFamily: 'Inter',
  },
  languageContainer: {
    marginBottom: 24,
  },
  languageIcon: {
    width: 32,
    height: 32,
  },
  biometricsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  biometricsText: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
  },
  logoutIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: '#fff',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#2196F3',
    borderRadius: 2,
  },
});

export default ProfileModal; 