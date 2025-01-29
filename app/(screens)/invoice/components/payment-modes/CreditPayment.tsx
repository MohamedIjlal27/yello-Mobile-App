import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import UploadIcon from '../../../../../assets/icons/upload.svg';
import styles from '@/app/styles/components/recordPaymentMethod';
import type { CameraCapturedPicture } from 'expo-camera';

interface CreditPaymentProps {
  paymentAmount: string;
  setPaymentAmount: (amount: string) => void;
  capturedImage: CameraCapturedPicture | null;
  handleUploadPress: () => void;
  handleRetake: () => void;
}

export default function CreditPayment({
  paymentAmount,
  setPaymentAmount,
  capturedImage,
  handleUploadPress,
  handleRetake
}: CreditPaymentProps) {
  return (
    <View style={styles.chequeFieldsContainer}>
      {/* Amount */}
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Amount<Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.textInput}
          value={paymentAmount}
          onChangeText={setPaymentAmount}
          keyboardType="numeric"
          placeholder="54,752.85"
        />
      </View>

      {/* Credit Slip Upload */}
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Credit Slip<Text style={styles.required}>*</Text></Text>
        <View style={styles.imageUploadContainer}>
          {capturedImage ? (
            <>
              <Image 
                source={{ uri: capturedImage.uri }} 
                style={styles.previewImage}
              />
              <TouchableOpacity 
                style={styles.retakeButton}
                onPress={handleRetake}
              >
                <Text style={styles.retakeText}>Retake</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={handleUploadPress}
            >
              <UploadIcon width={20} height={20} fill="#374151" />
              <Text style={styles.uploadText}>Upload Credit Slip</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
} 