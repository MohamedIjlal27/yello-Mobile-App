import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import type { CameraCapturedPicture } from 'expo-camera';
import UploadIcon from '../../../../assets/icons/upload.svg';
import RetakeIcon from '../../../../assets/icons/retake.svg';
import { BlurView } from 'expo-blur';
import RecordPaymentModal from './RecordPaymentModal';
import styles from '@/app/styles/components/uploadInvoiced';

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
const SCAN_AREA_HEIGHT = SCAN_AREA_WIDTH * 1.4; // A4 ratio approximately

const formatAmount = (amount: number) => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<CameraCapturedPicture | null>(null);
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

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
          setIsCameraVisible(false);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setIsCameraVisible(true);
  };

  const handleAcceptPayment = () => {
    setShowRecordPayment(true);
    setIsUploadModalVisible(false);
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