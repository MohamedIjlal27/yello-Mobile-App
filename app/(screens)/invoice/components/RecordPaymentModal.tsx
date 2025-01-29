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
  Pressable,
  Alert
} from 'react-native';
import { BlurView } from 'expo-blur';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import type { CameraCapturedPicture } from 'expo-camera';
import styles from '@/app/styles/components/recordPaymentMethod';
import PolygonIcon from '../../../../assets/icons/Polygon.svg';
import { createPayment } from '../../../../api/endpoints';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store/store';
import ACCOUNTNUMBERS from '@/app/constants/payment';
import CashPayment from './payment-modes/CashPayment';
import ChequePayment from './payment-modes/ChequePayment';
import OnlinePayment from './payment-modes/OnlinePayment';
import CreditPayment from './payment-modes/CreditPayment';

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
  orderId: number;
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
  accountId: string;
  receiptImage?: string;
}

const formatAmount = (amount: number) => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function RecordPaymentModal({
  visible,
  shopName,
  dueDate,
  amount,
  orderId: orderIdProp,
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
    accountId: '',
    receiptImage: undefined
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<CameraCapturedPicture | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  const userId = useSelector((state: RootState) => state.user.userId);

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
      accountId: '',
      receiptImage: undefined
    });
  };

  const handleSubmit = async () => {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      
      const paymentData = {
        salesperson_id: Number(userId),
        sales_order_id: Number(orderIdProp),
        amount: Number(paymentAmount),
        date: currentDate,
        type: selectedPaymentType.toLowerCase(),
        cheque_no: selectedPaymentType === 'Cheque' ? chequeDetails.chequeNumber : "",
        account_no: "",
        attachment: selectedPaymentType === 'Cash' ? "" : capturedImage?.base64 || ""
      };

      // Add account number based on payment type
      if (selectedPaymentType === 'Cheque') {
        paymentData.cheque_no = chequeDetails.chequeNumber;
        if (chequeDetails.accountNumber) {
          const selectedAccount = ACCOUNTNUMBERS.find(acc => acc.number === chequeDetails.accountNumber);
          if (selectedAccount) {
            paymentData.account_no = selectedAccount.id;
          }
        }
      } else if (selectedPaymentType === 'Online') {
        paymentData.account_no = onlineDetails.accountId;
      }

      console.log('Submitting payment:', paymentData);

      const response = await createPayment(paymentData);
      console.log('Payment response:', response);

      if (response.result.message === 'Credit payment created successfully' || 
          response.result.message === 'Payment recorded successfully!') {
        Alert.alert(
          "Success",
          response.result.message,
          [
            { 
              text: "OK", 
              onPress: () => {
                setShowSuccessPopup(false);
                onClose();
              }
            }
          ]
        );
      } else {
        Alert.alert(
          "Error",
          response.result.message || "Failed to record payment",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      Alert.alert(
        "Error",
        "Failed to record payment. Please try again.",
        [{ text: "OK" }]
      );
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

  const renderPaymentFields = () => {
    switch (selectedPaymentType) {
      case 'Cash':
    return (
          <CashPayment
            paymentAmount={paymentAmount}
            setPaymentAmount={setPaymentAmount}
          />
        );
      case 'Cheque':
        return (
          <ChequePayment
            paymentAmount={paymentAmount}
            setPaymentAmount={setPaymentAmount}
            chequeDetails={chequeDetails}
            setChequeDetails={setChequeDetails}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            handleDateChange={handleDateChange}
            showAccountDropdown={showAccountDropdown}
            setShowAccountDropdown={setShowAccountDropdown}
            capturedImage={capturedImage}
            handleUploadPress={handleUploadPress}
            handleRetake={handleRetake}
          />
        );
      case 'Online':
    return (
          <OnlinePayment
            paymentAmount={paymentAmount}
            setPaymentAmount={setPaymentAmount}
            onlineDetails={onlineDetails}
            setOnlineDetails={setOnlineDetails}
            showAccountDropdown={showAccountDropdown}
            setShowAccountDropdown={setShowAccountDropdown}
            capturedImage={capturedImage}
            handleUploadPress={handleUploadPress}
            handleRetake={handleRetake}
          />
        );
      case 'Credit':
    return (
          <CreditPayment
            paymentAmount={paymentAmount}
            setPaymentAmount={setPaymentAmount}
            capturedImage={capturedImage}
            handleUploadPress={handleUploadPress}
            handleRetake={handleRetake}
          />
        );
      default:
        return null;
    }
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

          {/* Payment Fields */}
          {renderPaymentFields()}

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

