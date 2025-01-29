import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import PolygonIcon from '../../../../../assets/icons/Polygon.svg';
import UploadIcon from '../../../../../assets/icons/upload.svg';
import styles from '@/app/styles/components/recordPaymentMethod';
import ACCOUNTNUMBERS from '@/app/constants/payment';
import type { CameraCapturedPicture } from 'expo-camera';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../../store/store';

interface OnlineDetails {
  accountNumber: string;
  accountId: string;
  receiptImage?: string;
}

interface OnlinePaymentProps {
  paymentAmount: string;
  setPaymentAmount: (amount: string) => void;
  onlineDetails: OnlineDetails;
  setOnlineDetails: (details: OnlineDetails | ((prev: OnlineDetails) => OnlineDetails)) => void;
  showAccountDropdown: boolean;
  setShowAccountDropdown: (show: boolean) => void;
  capturedImage: CameraCapturedPicture | null;
  handleUploadPress: () => void;
  handleRetake: () => void;
}

const OnlinePayment = ({
  paymentAmount,
  setPaymentAmount,
  onlineDetails,
  setOnlineDetails,
  showAccountDropdown,
  setShowAccountDropdown,
  capturedImage,
  handleUploadPress,
  handleRetake
}: OnlinePaymentProps) => {
  const bankAccounts = useSelector((state: RootState) => state.bankAccount.bankAccounts);

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

      {/* Bank Dropdown */}
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Bank<Text style={styles.required}>*</Text></Text>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowAccountDropdown(!showAccountDropdown)}
          >
            <Text style={styles.dropdownButtonText} numberOfLines={1}>
              {onlineDetails.accountNumber || 'Select Bank'}
            </Text>
            <View style={[styles.polygonIconContainer, showAccountDropdown && styles.polygonIconRotated]}>
              <PolygonIcon width={12} height={12} fill="#374151" />
            </View>
          </TouchableOpacity>
          {showAccountDropdown && (
            <View style={styles.dropdownList}>
              <ScrollView 
                style={styles.dropdownScroll}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {bankAccounts.map((account) => (
                  <TouchableOpacity
                    key={account.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setOnlineDetails((prev: OnlineDetails) => ({ 
                        ...prev, 
                        accountNumber: account.value,
                        accountId: account.id
                      }));
                      setShowAccountDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText} numberOfLines={1}>
                      {account.value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      {/* Receipt Upload */}
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Receipt<Text style={styles.required}>*</Text></Text>
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
              <Text style={styles.uploadText}>Upload Receipt</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default OnlinePayment; 