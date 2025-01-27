import { StyleSheet } from 'react-native';

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
      padding: 20,
      width: '90%',
      maxWidth: 400,
      height: 500,
    },
    modalContainerExtended: {
      height: 700,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      gap: 8,
    },
    separator: {
      height: 1,
      backgroundColor: '#E5E7EB',
      marginBottom: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: '#111827',
    },
    message: {
      fontSize: 16,
      color: '#374151',
      marginBottom: 16,
    },
    detailsContainer: {
      marginBottom: 20,
    },
    detailRow: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    label: {
      fontSize: 14,
      color: '#6B7280',
      width: 100,
    },
    value: {
      fontSize: 14,
      color: '#111827',
      fontWeight: '500',
    },
    actionButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      gap: 12,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F3F4F6',
      padding: 12,
      borderRadius: 8,
      justifyContent: 'center',
      gap: 8,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    selectedActionButton: {
      borderColor: '#EF4444',
      backgroundColor: '#FEF2F2',
    },
    buttonText: {
      fontSize: 14,
      color: '#374151',
      fontWeight: '500',
    },
    selectedButtonText: {
      color: '#EF4444',
    },
    bottomButtonsContainer: {
      marginTop: 'auto',
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    bottomButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
      justifyContent: 'center',
      gap: 8,
    },
    proceedButton: {
      backgroundColor: '#10B981',
    },
    discardButton: {
      backgroundColor: '#EF4444',
    },
    bottomButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    proceedText: {
      color: '#FFFFFF',
    },
    discardText: {
      color: '#FFFFFF',
    },
    discountInputContainer: {
      marginTop: 16,
      marginBottom: 16,
      alignItems: 'center',
    },
    discountInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      width: '80%',
    },
    discountAdjustmentIcon: {
      marginTop: 2,
    },
    discountInputWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F9FAFB',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      paddingHorizontal: 12,
      height: 48,
    },
    currencySymbol: {
      fontSize: 16,
      color: '#374151',
      marginRight: 8,
    },
    discountInput: {
      flex: 1,
      fontSize: 16,
      color: '#111827',
      height: '100%',
      textAlign: 'left',
    },
  });

export default styles; 