import { Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SCAN_AREA_WIDTH = SCREEN_WIDTH * 0.85;
const SCAN_AREA_HEIGHT = SCAN_AREA_WIDTH * 1.4; // A4 ratio approximately
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
      maxHeight: '90%',
      minHeight: 400,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
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
      marginBottom: 16,
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
      marginVertical: 16,
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
      marginTop: 16,
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
      marginTop: 16,
      marginBottom: 16,
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

  export default styles; 