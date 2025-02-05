import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GalleryIcon from '../../../assets/icons/Galary.svg';
import BankSlipIcon from '../../../assets/icons/BankSlip.svg';

interface ImageUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectGallery: () => void;
  onSelectBankSlip: () => void;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  visible,
  onClose,
  onSelectGallery,
  onSelectBankSlip
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title}>Image Upload</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.option} 
            onPress={onSelectGallery}
          >
            <View style={styles.iconContainer}>
              <GalleryIcon width={24} height={24} />
            </View>
            <Text style={styles.optionText}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.option} 
            onPress={onSelectBankSlip}
          >
            <View style={styles.iconContainer}>
              <BankSlipIcon width={24} height={24} />
            </View>
            <Text style={styles.optionText}>Bank Deposit Slip</Text>
          </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
});

export default ImageUploadModal; 