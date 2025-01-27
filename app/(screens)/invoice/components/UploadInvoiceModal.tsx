import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Dimensions, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import type { CameraCapturedPicture } from 'expo-camera';
import UploadIcon from '../../../../assets/icons/upload.svg';
import RetakeIcon from '../../../../assets/icons/retake.svg';
import { BlurView } from 'expo-blur';
import RecordPaymentModal from './RecordPaymentModal';
import styles from '@/app/styles/components/uploadInvoiced';
import { attachImage } from '@/api/endpoints';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

interface UploadInvoiceModalProps {
  shopName: string;
  paymentType: string;
  dueDate: string;
  amount: number;
  onClose: () => void;
  onUpload: () => void;
  onAcceptPayment: (paymentType: string, amount: number) => void;
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

const UploadInvoiceModal = ({
  shopName,
  paymentType,
  dueDate,
  amount,
  onClose,
  onUpload,
  onAcceptPayment,
}: UploadInvoiceModalProps) => {
  const orderId = useSelector((state: RootState) => state.user.orderId);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<CameraCapturedPicture | null>(null);
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [imageFilename, setImageFilename] = useState<string>('');

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
          const filename = generateUniqueFilename(orderId);
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
      if (!orderId) {
        Alert.alert(
          'Error',
          'Order ID is missing. Please try again.',
          [{ text: 'OK' }]
        );
        return;
      }

      if (capturedImage && capturedImage.base64 && imageFilename) {
        const validOrderId = orderId.toString().trim();
        if (!validOrderId || isNaN(Number(validOrderId))) {
          Alert.alert(
            'Error',
            'Invalid Order ID format',
            [{ text: 'OK' }]
          );
          return;
        }

        const response = await attachImage({
          sales_order_id: validOrderId,
          image_base64: capturedImage.base64,
          filename: imageFilename
        });
        
        if (response?.result?.error) {
          Alert.alert(
            'Upload Failed',
            response.result.error || 'Failed to upload invoice image',
            [{ text: 'OK' }]
          );
          return;
        }

        if (!response?.result?.attachment_id) {
          Alert.alert(
            'Upload Failed',
            'Failed to upload invoice image',
            [{ text: 'OK' }]
          );
          return;
        }

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
      Alert.alert(
        'Error',
        'Failed to upload invoice image. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handlePaymentSubmit = (paymentType: string, amount: number) => {
    setShowRecordPayment(false);
    onAcceptPayment(paymentType, amount);
  };

  const handleCloseRecordPayment = () => {
    setShowRecordPayment(false);
    onClose();
  };

  const renderScannerOverlay = () => {
    return (
      <View style={styles.scannerOverlay}>
        <View style={styles.scanArea}>
          {/* Corner Guidelines */}
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
          
          <Text style={styles.scanText}>
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
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            {/* Header with close button */}
            <View style={styles.header}>
              <Text style={styles.title}>Upload Invoice</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Image
                  source={require('../../../../assets/icons/close.png')}
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Shop Details */}
            <View style={styles.shopDetails}>
              <View style={styles.shopInfoContainer}>
                <Text style={styles.shopName}>{shopName}</Text>
                <View style={styles.paymentDetails}>
                  <Text style={styles.paymentType}>{paymentType}</Text>
                  <Text style={styles.separator}>|</Text>
                  <Text style={styles.dueDate}>{dueDate}</Text>
                </View>
              </View>
              <Text style={styles.amount}>LKR {formatAmount(amount)}</Text>
            </View>

            {/* Image Preview */}
            {capturedImage && (
              <View style={styles.previewContainer}>
                <Image 
                  source={{ uri: capturedImage.uri }} 
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              </View>
            )}

            {/* Upload/Retake Button */}
            <TouchableOpacity 
              style={[
                styles.uploadButton,
                capturedImage ? styles.retakeButton : null
              ]} 
              onPress={capturedImage ? handleRetake : handleUploadPress}
            >
              {capturedImage ? (
                <RetakeIcon width={24} height={24} />
              ) : (
                <UploadIcon width={24} height={24} fill="#374151" />
              )}
              <Text style={[
                styles.uploadText,
                capturedImage ? styles.retakeText : null
              ]}>
                {capturedImage ? 'Retake' : 'Upload Invoice'}
              </Text>
            </TouchableOpacity>

            {/* Accept Payment Button */}
            <TouchableOpacity 
              style={[
                styles.acceptButton,
                capturedImage ? styles.acceptButtonWithImage : styles.acceptButtonDisabled
              ]} 
              onPress={handleAcceptPayment}
              disabled={!capturedImage}
            >
              <Text style={[
                styles.acceptText,
                !capturedImage && styles.acceptTextDisabled
              ]}>ACCEPT PAYMENT</Text>
            </TouchableOpacity>

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
      )}

      <RecordPaymentModal
        visible={showRecordPayment}
        shopName={shopName}
        dueDate={dueDate}
        amount={amount}
        onClose={handleCloseRecordPayment}
        onSubmit={handlePaymentSubmit}
      />
    </>
  );
};

export default UploadInvoiceModal;