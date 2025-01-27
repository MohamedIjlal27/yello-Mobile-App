import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Image,
  Dimensions,
  ScrollView,
  Modal,
  Pressable
} from 'react-native';
import { BlurView } from 'expo-blur';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import type { CameraCapturedPicture } from 'expo-camera';
import styles from '@/app/styles/components/recordPaymentMethod';
import PolygonIcon from '../../../../assets/icons/Polygon.svg';

// Icons
import CashIcon from '../../../../assets/icons/invoiceCash.svg';
import ChequeIcon from '../../../../assets/icons/cheque.svg';
import OnlineIcon from '../../../../assets/icons/online.svg';
import CreditIcon from '../../../../assets/icons/credit.svg';
import DenominationIcon from '../../../../assets/icons/denomination.svg';
import UploadIcon from '../../../../assets/icons/upload.svg';

interface RecordPaymentModalProps {
  visible: boolean;
  shopName: string;
  dueDate: string;
  amount: number;
  onClose: () => void;
  onSubmit: (paymentType: string, amount: number, additionalData?: any) => void;
}

type PaymentType = 'Cash' | 'Cheque' | 'Online' | 'Credit';

interface ChequeDetails {
  chequeNumber: string;
  chequeDate: Date;
  accountNumber: string;
  chequeImage?: string;
}

interface OnlineDetails {
  accountNumber: string;
  receiptImage?: string;
}

// Add account number options
const ACCOUNT_NUMBERS = [
  { id: '1', number: '8217003589', bank: 'Commercial Bank' },
  { id: '2', number: '7156982430', bank: 'Sampath Bank' },
  { id: '3', number: '9304521678', bank: 'HNB Bank' },
  { id: '4', number: '6549873210', bank: 'BOC Bank' }
];

const formatAmount = (amount: number) => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function RecordPaymentModal({
  visible,
  shopName,
  dueDate,
  amount,
  onClose,
  onSubmit
}: RecordPaymentModalProps) {
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType>('Cash');
  const [paymentAmount, setPaymentAmount] = useState(amount.toString());
  const [chequeDetails, setChequeDetails] = useState<ChequeDetails>({
    chequeNumber: '',
    chequeDate: new Date(),
    accountNumber: '',
    chequeImage: undefined
  });
  const [onlineDetails, setOnlineDetails] = useState<OnlineDetails>({
    accountNumber: '',
    receiptImage: undefined
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<CameraCapturedPicture | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const handlePaymentTypeSelect = (type: PaymentType) => {
    setSelectedPaymentType(type);
    // Reset image and payment details when switching payment types
    setCapturedImage(null);
    setChequeDetails({
      chequeNumber: '',
      chequeDate: new Date(),
      accountNumber: '',
      chequeImage: undefined
    });
    setOnlineDetails({
      accountNumber: '',
      receiptImage: undefined
    });
  };

  const handleSubmit = () => {
    if (selectedPaymentType === 'Cheque') {
      onSubmit(selectedPaymentType, Number(paymentAmount), chequeDetails);
    } else if (selectedPaymentType === 'Online') {
      onSubmit(selectedPaymentType, Number(paymentAmount), onlineDetails);
    } else {
      onSubmit(selectedPaymentType, Number(paymentAmount));
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setChequeDetails(prev => ({ ...prev, chequeDate: selectedDate }));
    }
  };

  const handleUploadPress = async () => {
    if (!permission?.granted) {
      const permissionResult = await requestPermission();
      if (!permissionResult.granted) {
        return;
      }
    }
    setIsCameraVisible(true);
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          setCapturedImage(photo);
          setChequeDetails(prev => ({ ...prev, chequeImage: photo.uri }));
          setIsCameraVisible(false);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setChequeDetails(prev => ({ ...prev, chequeImage: undefined }));
    setIsCameraVisible(true);
  };

  const renderChequeFields = () => {
    if (selectedPaymentType !== 'Cheque') return null;

    return (
      <View style={styles.chequeFieldsContainer}>
        {/* Cheque Number */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Cheque Number<Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.textInput}
            value={chequeDetails.chequeNumber}
            onChangeText={(text) => setChequeDetails(prev => ({ ...prev, chequeNumber: text }))}
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
                {chequeDetails.accountNumber ? 
                  ACCOUNT_NUMBERS.find(acc => acc.number === chequeDetails.accountNumber)?.bank + ' - ' + chequeDetails.accountNumber 
                  : 'Select Account Number'}
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
                  {ACCOUNT_NUMBERS.map((account) => (
                    <TouchableOpacity
                      key={account.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setChequeDetails(prev => ({ ...prev, accountNumber: account.number }));
                        setShowAccountDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText} numberOfLines={1}>
                        {account.bank} - {account.number}
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

  const renderOnlineFields = () => {
    if (selectedPaymentType !== 'Online') return null;

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

        {/* Account Number Dropdown */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Account Number<Text style={styles.required}>*</Text></Text>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowAccountDropdown(!showAccountDropdown)}
            >
              <Text style={styles.dropdownButtonText} numberOfLines={1}>
                {onlineDetails.accountNumber ? 
                  ACCOUNT_NUMBERS.find(acc => acc.number === onlineDetails.accountNumber)?.bank + ' - ' + onlineDetails.accountNumber 
                  : 'Select Account Number'}
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
                  {ACCOUNT_NUMBERS.map((account) => (
                    <TouchableOpacity
                      key={account.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setOnlineDetails(prev => ({ ...prev, accountNumber: account.number }));
                        setShowAccountDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText} numberOfLines={1}>
                        {account.bank} - {account.number}
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

  const renderCreditFields = () => {
    if (selectedPaymentType !== 'Credit') return null;

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
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <BlurView intensity={20} style={StyleSheet.absoluteFill} />
      <View style={[
        styles.modalContainer,
        selectedPaymentType === 'Cheque' && styles.modalContainerExpanded
      ]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Image
                source={require('../../../../assets/icons/close.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Record Payment</Text>
          </View>

          {/* Shop Details */}
          <View style={styles.shopDetails}>
            <Text style={styles.shopName}>{shopName}</Text>
            <View style={styles.paymentInfo}>
              <Text style={styles.dueDate}>{dueDate}</Text>
              <Text style={styles.amount}>LKR {formatAmount(amount)}</Text>
            </View>
          </View>

          {/* Payment Type Selection */}
          <View style={styles.paymentTypeContainer}>
            <TouchableOpacity 
              style={[
                styles.paymentTypeButton,
                selectedPaymentType === 'Cash' && styles.selectedPaymentType
              ]}
              onPress={() => handlePaymentTypeSelect('Cash')}
            >
              <CashIcon width={24} height={24} fill={selectedPaymentType === 'Cash' ? '#EF4444' : '#374151'} />
              <Text style={[
                styles.paymentTypeText,
                selectedPaymentType === 'Cash' && styles.selectedPaymentTypeText
              ]}>Cash</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.paymentTypeButton,
                selectedPaymentType === 'Cheque' && styles.selectedPaymentType
              ]}
              onPress={() => handlePaymentTypeSelect('Cheque')}
            >
              <ChequeIcon width={24} height={24} fill={selectedPaymentType === 'Cheque' ? '#EF4444' : '#374151'} />
              <Text style={[
                styles.paymentTypeText,
                selectedPaymentType === 'Cheque' && styles.selectedPaymentTypeText
              ]}>Cheque</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.paymentTypeButton,
                selectedPaymentType === 'Online' && styles.selectedPaymentType
              ]}
              onPress={() => handlePaymentTypeSelect('Online')}
            >
              <OnlineIcon width={24} height={24} fill={selectedPaymentType === 'Online' ? '#EF4444' : '#374151'} />
              <Text style={[
                styles.paymentTypeText,
                selectedPaymentType === 'Online' && styles.selectedPaymentTypeText
              ]}>Online</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.paymentTypeButton,
                selectedPaymentType === 'Credit' && styles.selectedPaymentType
              ]}
              onPress={() => handlePaymentTypeSelect('Credit')}
            >
              <CreditIcon width={24} height={24} fill={selectedPaymentType === 'Credit' ? '#EF4444' : '#374151'} />
              <Text style={[
                styles.paymentTypeText,
                selectedPaymentType === 'Credit' && styles.selectedPaymentTypeText
              ]}>Credit</Text>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          {selectedPaymentType === 'Cash' && (
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Amount</Text>
              <View style={styles.amountInputWrapper}>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencyLabel}>LKR</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={paymentAmount}
                    onChangeText={setPaymentAmount}
                    keyboardType="numeric"
                    placeholder="0.00"
                  />
                </View>
                <TouchableOpacity style={styles.denominationButton}>
                  <DenominationIcon width={24} height={24} fill="#374151" />
                  <Text style={styles.denominationText}>Denomination</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Cheque Fields */}
          {renderChequeFields()}

          {/* Online Fields */}
          {renderOnlineFields()}

          {/* Credit Fields */}
          {renderCreditFields()}

          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              {selectedPaymentType === 'Credit' ? 'REQUEST APPROVAL' : 'SUBMIT'}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Camera Modal */}
        <Modal
          visible={isCameraVisible}
          transparent={true}
          animationType="slide"
        >
          <BlurView intensity={70} style={styles.blurContainer}>
            <View style={styles.cameraContainer}>
              <CameraView 
                ref={cameraRef}
                style={styles.camera} 
                facing="back"
              >
                <View style={styles.cameraControls}>
                  <TouchableOpacity 
                    style={styles.closeCamera} 
                    onPress={() => setIsCameraVisible(false)}
                  >
                    <Text style={styles.closeCameraText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.captureButton}
                    onPress={handleTakePicture}
                  >
                    <View style={styles.captureCircle} />
                  </TouchableOpacity>
                </View>
              </CameraView>
            </View>
          </BlurView>
        </Modal>
      </View>
    </View>
  );
}

