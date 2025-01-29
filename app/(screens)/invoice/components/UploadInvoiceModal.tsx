import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import type { CameraCapturedPicture } from 'expo-camera';
import UploadIcon from '../../../../assets/icons/upload.svg';
import RetakeIcon from '../../../../assets/icons/retake.svg';
import { BlurView } from 'expo-blur';
import RecordPaymentModal from './RecordPaymentModal';
import baseStyles from '@/app/styles/components/uploadInvoiced';
import { attachImage } from '@/api/endpoints';
import { RootState } from '@/store/store';
import { useSelector, useDispatch } from 'react-redux';
import { setBankAccounts, setCustomerAccounts } from '../../../../store/slices/bankAccountSlice';
import { initDatabase, insertBankAccounts, insertCustomerAccounts, BankAccount, CustomerAccount } from '../../../../store/database';
import type { ImageAttachmentResponse } from '@/api/endpoints';

interface UploadInvoiceModalProps {
  shopName: string;
  paymentType: string;
  dueDate: string;
  amount: number;
  orderId: number;
  onClose: () => void;
  onUpload: () => void;
  onAcceptPayment: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SCAN_AREA_WIDTH = SCREEN_WIDTH * 0.85;
const SCAN_AREA_HEIGHT = SCAN_AREA_WIDTH * 1.4;

const formatAmount = (amount: number) => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const generateUniqueFilename = (orderId: string) => {
  const timestamp = new Date().getTime();
  return `invoice_${orderId}_${timestamp}.jpg`;
};

interface ApiResponse {
  jsonrpc: string;
  id: null;
  result: {
    message?: string;
    attachment_id?: number;
    error?: string;
    bank_accounts?: { [key: string]: string };
    customer_accounts?: string[];
  };
}

const UploadInvoiceModal = ({
  shopName,
  paymentType,
  dueDate,
  amount,
  orderId,
  onClose,
  onUpload,
  onAcceptPayment
}: UploadInvoiceModalProps) => {
  const orderIdState = useSelector((state: RootState) => state.user.orderId);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<CameraCapturedPicture | null>(null);
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [imageFilename, setImageFilename] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();

  // Initialize database when component mounts
  useEffect(() => {
    initDatabase();
  }, []);

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
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.7,
        });
        if (photo) {
          const filename = generateUniqueFilename(orderIdState);
          setImageFilename(filename);
          setCapturedImage(photo);
          setIsCameraVisible(false);
        }
      } catch (error) {
        Alert.alert(
          'Error',
          'Failed to capture image. Please try again.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setIsCameraVisible(true);
  };

  const handleAcceptPayment = async () => {
    try {
      if (!orderIdState) {
        Alert.alert(
          'Error',
          'Order ID is missing. Please try again.',
          [{ text: 'OK' }]
        );
        return;
      }

      if (capturedImage && capturedImage.base64 && imageFilename) {
        const validOrderId = orderIdState.toString().trim();
        if (!validOrderId || isNaN(Number(validOrderId))) {
          Alert.alert(
            'Error',
            'Invalid Order ID format',
            [{ text: 'OK' }]
          );
          return;
        }

        setIsUploading(true);

        const response: ImageAttachmentResponse = await attachImage({
          sales_order_id: validOrderId,
          image_base64: capturedImage.base64,
          filename: imageFilename
        });
        
        if (response?.result?.error) {
          setIsUploading(false);
          Alert.alert(
            'Upload Failed',
            response.result.error || 'Failed to upload invoice image',
            [{ text: 'OK' }]
          );
          return;
        }

        if (!response?.result?.attachment_id) {
          setIsUploading(false);
          Alert.alert(
            'Upload Failed',
            'Failed to upload invoice image',
            [{ text: 'OK' }]
          );
          return;
        }

        // Store bank account details directly in Redux and SQLite
        if (response.result.bank_accounts) {
          const bankAccounts: BankAccount[] = Object.entries(response.result.bank_accounts).map(([id, value]) => ({
            id,
            value: value as string
          }));
          dispatch(setBankAccounts(bankAccounts));
          // Store in SQLite
          insertBankAccounts(response.result.bank_accounts);
        }
        
        if (response.result.customer_accounts && Array.isArray(response.result.customer_accounts)) {
          const customerAccounts: CustomerAccount[] = response.result.customer_accounts.map((value: string, index: number) => ({
            id: index.toString(),
            value
          }));
          dispatch(setCustomerAccounts(customerAccounts));
          // Store in SQLite
          insertCustomerAccounts(response.result.customer_accounts);
        }

        setIsUploading(false);
        Alert.alert(
          'Success',
          'Invoice image uploaded successfully',
          [{ text: 'OK' }]
        );
        
        setShowRecordPayment(true);
        setIsUploadModalVisible(false);
      } else {
        Alert.alert(
          'Error',
          'Missing required image data. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
      Alert.alert(
        'Error',
        'Failed to upload invoice image. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handlePaymentSubmit = (paymentType: string, amount: number) => {
    setShowRecordPayment(false);
    onAcceptPayment();
  };

  const handleCloseRecordPayment = () => {
    setShowRecordPayment(false);
    onClose();
  };

  const renderScannerOverlay = () => {
    return (
      <View style={baseStyles.scannerOverlay}>
        <View style={baseStyles.scanArea}>
          {/* Corner Guidelines */}
          <View style={[baseStyles.corner, baseStyles.cornerTopLeft]} />
          <View style={[baseStyles.corner, baseStyles.cornerTopRight]} />
          <View style={[baseStyles.corner, baseStyles.cornerBottomLeft]} />
          <View style={[baseStyles.corner, baseStyles.cornerBottomRight]} />
          
          <Text style={baseStyles.scanText}>
            Position your invoice within the frame
          </Text>
        </View>
      </View>
    );
  };

  if (!isUploadModalVisible && !showRecordPayment) {
    return null;
  }

  return (
    <>
      {isUploadModalVisible && (
        <View style={baseStyles.overlay}>
          <View style={baseStyles.modalContainer}>
            {/* Header with close button */}
            <View style={baseStyles.header}>
              <Text style={baseStyles.title}>Upload Invoice</Text>
              <TouchableOpacity onPress={onClose} style={baseStyles.closeButton}>
                <Image
                  source={require('../../../../assets/icons/close.png')}
                  style={baseStyles.closeIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Shop Details */}
            <View style={baseStyles.shopDetails}>
              <View style={baseStyles.shopInfoContainer}>
                <Text style={baseStyles.shopName}>{shopName}</Text>
                <View style={baseStyles.paymentDetails}>
                  <Text style={baseStyles.paymentType}>{paymentType}</Text>
                  <Text style={baseStyles.separator}>|</Text>
                  <Text style={baseStyles.dueDate}>{dueDate}</Text>
                </View>
              </View>
              <Text style={baseStyles.amount}>LKR {formatAmount(amount)}</Text>
            </View>

            {/* Image Preview */}
            {capturedImage && (
              <View style={baseStyles.previewContainer}>
                <Image 
                  source={{ uri: capturedImage.uri }} 
                  style={baseStyles.previewImage}
                  resizeMode="contain"
                />
              </View>
            )}

            {/* Loading Overlay */}
            {isUploading && (
              <View style={additionalStyles.loadingOverlay}>
                <View style={additionalStyles.loadingContainer}>
                  <ActivityIndicator size="large" color="#10B981" />
                  <Text style={additionalStyles.loadingText}>Uploading invoice...</Text>
                </View>
              </View>
            )}

            {/* Upload/Retake Button */}
            <TouchableOpacity 
              style={[
                baseStyles.uploadButton,
                capturedImage ? baseStyles.retakeButton : null
              ]} 
              onPress={capturedImage ? handleRetake : handleUploadPress}
            >
              {capturedImage ? (
                <RetakeIcon width={24} height={24} />
              ) : (
                <UploadIcon width={24} height={24} fill="#374151" />
              )}
              <Text style={[
                baseStyles.uploadText,
                capturedImage ? baseStyles.retakeText : null
              ]}>
                {capturedImage ? 'Retake' : 'Upload Invoice'}
              </Text>
            </TouchableOpacity>

            {/* Accept Payment Button */}
            <TouchableOpacity 
              style={[
                baseStyles.acceptButton,
                capturedImage ? baseStyles.acceptButtonWithImage : baseStyles.acceptButtonDisabled,
                isUploading && baseStyles.acceptButtonDisabled
              ]} 
              onPress={handleAcceptPayment}
              disabled={!capturedImage || isUploading}
            >
              {isUploading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={[
                  baseStyles.acceptText,
                  !capturedImage && baseStyles.acceptTextDisabled
                ]}>ACCEPT PAYMENT</Text>
              )}
            </TouchableOpacity>

            {/* Camera Modal */}
            <Modal
              visible={isCameraVisible}
              transparent={true}
              animationType="slide"
            >
              <BlurView intensity={70} style={baseStyles.blurContainer}>
                <View style={baseStyles.cameraContainer}>
                  <CameraView 
                    ref={cameraRef}
                    style={baseStyles.camera} 
                    facing="back"
                  >
                    <View style={baseStyles.cameraControls}>
                      <TouchableOpacity 
                        style={baseStyles.closeCamera} 
                        onPress={() => setIsCameraVisible(false)}
                      >
                        <Text style={baseStyles.closeCameraText}>Close</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={baseStyles.captureButton}
                        onPress={handleTakePicture}
                      >
                        <View style={baseStyles.captureCircle} />
                      </TouchableOpacity>
                    </View>
                  </CameraView>
                </View>
              </BlurView>
            </Modal>
          </View>
        </View>
      )}

      <RecordPaymentModal
        visible={showRecordPayment}
        shopName={shopName}
        dueDate={dueDate}
        amount={amount}
        orderId={orderId}
        onClose={() => setShowRecordPayment(false)}
        onSubmit={handlePaymentSubmit}
      />
    </>
  );
};

// Add these styles to your existing styles
const additionalStyles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
});

const styles = { ...baseStyles, ...additionalStyles };

export default UploadInvoiceModal;