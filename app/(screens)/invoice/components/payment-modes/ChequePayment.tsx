import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import PolygonIcon from '../../../../../assets/icons/Polygon.svg';
import UploadIcon from '../../../../../assets/icons/upload.svg';
import styles from '@/app/styles/components/recordPaymentMethod';
import ACCOUNTNUMBERS from '@/app/constants/payment';
import type { CameraCapturedPicture } from 'expo-camera';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../../store/store';

interface ChequePaymentProps {
  paymentAmount: string;
  setPaymentAmount: (amount: string) => void;
  chequeDetails: {
    chequeNumber: string;
    chequeDate: Date;
    accountNumber: string;
    chequeImage?: string;
  };
  setChequeDetails: (details: any) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  handleDateChange: (event: any, selectedDate?: Date) => void;
  showAccountDropdown: boolean;
  setShowAccountDropdown: (show: boolean) => void;
  capturedImage: CameraCapturedPicture | null;
  handleUploadPress: () => void;
  handleRetake: () => void;
}

const ChequePayment = ({
  paymentAmount,
  setPaymentAmount,
  chequeDetails,
  setChequeDetails,
  showDatePicker,
  setShowDatePicker,
  handleDateChange,
  showAccountDropdown,
  setShowAccountDropdown,
  capturedImage,
  handleUploadPress,
  handleRetake
}: ChequePaymentProps) => {
  const customerAccounts = useSelector((state: RootState) => state.bankAccount.customerAccounts);

  return (
    <View style={styles.chequeFieldsContainer}>
      {/* Cheque Number */}
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Cheque Number<Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.textInput}
          value={chequeDetails.chequeNumber}
          onChangeText={(text) => setChequeDetails((prev: any) => ({ ...prev, chequeNumber: text }))}
          placeholder="225856"
        />
      </View>

      {/* Cheque Date */}
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Cheque Date<Text style={styles.required}>*</Text></Text>
        <TouchableOpacity 
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {chequeDetails.chequeDate.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={chequeDetails.chequeDate}
            mode="date"
            onChange={handleDateChange}
          />
        )}
      </View>

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

      {/* Account Number Dropdown */}
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Account Number<Text style={styles.required}>*</Text></Text>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowAccountDropdown(!showAccountDropdown)}
          >
            <Text style={styles.dropdownButtonText} numberOfLines={1}>
              {chequeDetails.accountNumber || "Select Account Number"}
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
                {customerAccounts.map((account, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setChequeDetails((prev: any) => ({ ...prev, accountNumber: account }));
                      setShowAccountDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText} numberOfLines={1}>
                      {account}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      {/* Image Upload */}
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Image<Text style={styles.required}>*</Text></Text>
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
              <Text style={styles.uploadText}>Upload Image</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default ChequePayment; 