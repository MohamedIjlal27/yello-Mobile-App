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
  Modal
} from 'react-native';
import { BlurView } from 'expo-blur';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import type { CameraCapturedPicture } from 'expo-camera';

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<CameraCapturedPicture | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const handlePaymentTypeSelect = (type: PaymentType) => {
    setSelectedPaymentType(type);
    // Reset image and cheque details when switching payment types
    setCapturedImage(null);
    setChequeDetails({
      chequeNumber: '',
      chequeDate: new Date(),
      accountNumber: '',
      chequeImage: undefined
    });
  };

  const handleSubmit = () => {
    if (selectedPaymentType === 'Cheque') {
      onSubmit(selectedPaymentType, Number(paymentAmount), chequeDetails);
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

        {/* Account Number */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Account Number<Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.textInput}
            value={chequeDetails.accountNumber}
            onChangeText={(text) => setChequeDetails(prev => ({ ...prev, accountNumber: text }))}
            placeholder="8217003589"
            keyboardType="numeric"
          />
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

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    maxHeight: '80%',
  },
  modalContainerExpanded: {
    height: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  shopDetails: {
    backgroundColor: '#FFFDD8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 14,
    color: '#4B5563',
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  paymentTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  paymentTypeButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedPaymentType: {
    borderColor: '#EF4444',
    backgroundColor: '#F3F4F6',
  },
  paymentTypeText: {
    fontSize: 12,
    color: '#374151',
    marginTop: 4,
  },
  selectedPaymentTypeText: {
    color: '#EF4444',
    fontWeight: '500',
  },
  amountContainer: {
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amountInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
  },
  currencyLabel: {
    fontSize: 16,
    color: '#374151',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#111827',

  },
  denominationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  denominationText: {
    fontSize: 14,
    color: '#374151',
  },
  chequeFieldsContainer: {
    marginTop: 8,
    marginBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#374151',
    width: 120,
  },
  required: {
    color: '#EF4444',
    marginLeft: 2,
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111827',
  },
  dateInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#111827',
  },
  uploadButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadText: {
    fontSize: 14,
    color: '#6366F1',
  },
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  imageUploadContainer: {
    flex: 1,
  },
  previewImage: {
    width: '100%',
    height: 120,
    borderRadius: 4,
    marginBottom: 8,
  },
  retakeButton: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  retakeText: {
    color: '#374151',
    fontSize: 14,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  closeCamera: {
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
  },
  closeCameraText: {
    color: 'white',
    fontSize: 16,
  },
  captureButton: {
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'white',
  },
  blurContainer: {
    flex: 1,
  },
}); 