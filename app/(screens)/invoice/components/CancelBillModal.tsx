import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import WarningIcon from '../../../../assets/icons/warning.svg';
import CancelIcon from '../../../../assets/icons/cancel.svg';
import DiscountIcon from '../../../../assets/icons/discount.svg';
import CheckIcon from '../../../../assets/icons/check.svg';
import CloseIcon from '../../../../assets/icons/close.svg';

interface CancelBillModalProps {
  invoiceNo: string;
  customer: string;
  amount: number;
  onProceed: () => void;
  onDiscard: () => void;
}

const formatAmount = (amount: number) => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const CancelBillModal = ({
  invoiceNo,
  customer,
  amount,
  onProceed,
  onDiscard,
}: CancelBillModalProps) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        {/* Warning Icon and Title */}
        <View style={styles.header}>
          <WarningIcon width={24} height={24} fill="#FFB020" />
          <Text style={styles.title}>Cancel Bill</Text>
        </View>

        {/* Separator Line */}
        <View style={styles.separator} />

        {/* Message */}
        <Text style={styles.message}>
          Are you sure you want to Cancel the following invoice?
        </Text>

        {/* Invoice Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Invoice No :</Text>
            <Text style={styles.value}>{invoiceNo}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Customer :</Text>
            <Text style={styles.value}>{customer}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Amount :</Text>
            <Text style={styles.value}>LKR {formatAmount(amount)}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onProceed}
          >
            <CancelIcon width={20} height={20} fill="#374151" />
            <Text style={styles.buttonText}>Cancel Bill</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.discountButton]}
            onPress={onDiscard}
          >
            <DiscountIcon width={20} height={20} fill="#374151" />
            <Text style={styles.buttonText}>Discount Adjustment</Text>
          </TouchableOpacity>
        </View>

        {/* Proceed/Discard Buttons */}
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity 
            style={[styles.bottomButton, styles.proceedButton]}
            onPress={onProceed}
          >
            <CheckIcon width={20} height={20} fill="#FFFFFF" />
            <Text style={[styles.bottomButtonText, styles.proceedText]}>PROCEED</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.bottomButton, styles.discardButton]}
            onPress={onDiscard}
          >
            <CloseIcon width={20} height={20} fill="#FFFFFF" />
            <Text style={[styles.bottomButtonText, styles.discardText]}>DISCARD</Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
    width: '90%',
    maxWidth: 400,
    height: 500,
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
  },
  discountButton: {
    backgroundColor: '#F3F4F6',
  },
  buttonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  bottomButtonsContainer: {
    marginTop: 120,
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
});

export default CancelBillModal; 