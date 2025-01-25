import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import type { CameraCapturedPicture } from 'expo-camera';
import UploadIcon from '../../../../assets/icons/upload.svg';
import RetakeIcon from '../../../../assets/icons/retake.svg';
import { BlurView } from 'expo-blur';

interface UploadInvoiceModalProps {
  shopName: string;
  paymentType: string;
  dueDate: string;
  amount: number;
  onClose: () => void;
  onUpload: () => void;
  onAcceptPayment: () => void;
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

  return (
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
          onPress={onAcceptPayment}
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
  );
};

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
    height: 652
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  shopDetails: {
    backgroundColor: '#FFFDD8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopInfoContainer: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  paymentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentType: {
    fontSize: 14,
    color: '#4B5563',
  },
  separator: {
    marginHorizontal: 8,
    color: '#4B5563',
  },
  dueDate: {
    fontSize: 14,
    color: '#4B5563',
  },
  amount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 16,
  },
  previewContainer: {
    height: 200,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 16,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    marginTop: 160,
    gap: 8,
  },
  retakeButton: {
    backgroundColor: '#D9D9D9',
    marginTop: 8,
  },
  retakeText: {
    color: '#000000',
  },
  uploadText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  acceptButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 200,
  },
  acceptButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  acceptButtonWithImage: {
    marginTop: 8,
  },
  acceptText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  acceptTextDisabled: {
    color: '#9CA3AF',
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
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: SCAN_AREA_WIDTH,
    height: SCAN_AREA_HEIGHT,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#FFFFFF',
  },
  cornerTopLeft: {
    top: -1,
    left: -1,
    borderLeftWidth: 3,
    borderTopWidth: 3,
  },
  cornerTopRight: {
    top: -1,
    right: -1,
    borderRightWidth: 3,
    borderTopWidth: 3,
  },
  cornerBottomLeft: {
    bottom: -1,
    left: -1,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
  },
  cornerBottomRight: {
    bottom: -1,
    right: -1,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  scanText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    position: 'absolute',
    bottom: -40,
    width: '100%',
  },
  blurContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default UploadInvoiceModal;