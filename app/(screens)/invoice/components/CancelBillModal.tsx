import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Pressable, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import WarningIcon from '../../../../assets/icons/warning.svg';
import CancelIcon from '../../../../assets/icons/cancel.svg';
import DiscountIcon from '../../../../assets/icons/discount.svg';
import CheckIcon from '../../../../assets/icons/check.svg';
import CloseIcon from '../../../../assets/icons/close.svg';
import DiscountAdjustmentIcon from '../../../../assets/icons/discountAdjustment.svg';
import CommentIcon from '../../../../assets/icons/comments.svg';
import CustomDropdown from '../../../../components/ui/CustomDropdown';
import { BlurView } from 'expo-blur';

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
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [discount, setDiscount] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const reasonInputRef = useRef(null);

  const reasons = [
    'Select Reason',
    'Damaged Products',
    'Wrong Quantity',
    'Price Mismatch',
    'Quality Issues',
    'Other'
  ];

  const handleDiscountPress = () => {
    setShowDiscountInput(true);
    setShowReasonInput(false);
  };

  const handleCancelBillPress = () => {
    setShowDiscountInput(true);
    setShowReasonInput(true);
  };

  return (
    <View style={styles.overlay}>
      <View style={[
        styles.modalContainer,
        isDropdownOpen && styles.modalContainerExtended
      ]}>
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
            onPress={handleCancelBillPress}
          >
            <CancelIcon width={20} height={20} fill="#374151" />
            <Text style={styles.buttonText}>Cancel Bill</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.discountButton]}
            onPress={handleDiscountPress}
          >
            <DiscountIcon width={20} height={20} fill="#374151" />
            <Text style={styles.buttonText}>Discount Adjustment</Text>
          </TouchableOpacity>
        </View>

        {/* Discount Input Field */}
        {showDiscountInput && (
          <View style={styles.discountInputContainer}>
            <View style={styles.discountInputRow}>
              <DiscountAdjustmentIcon width={27} height={27} style={styles.discountAdjustmentIcon} />
              <View style={styles.discountInputWrapper}>
                <Text style={styles.currencySymbol}>LKR</Text>
                <TextInput
                  style={styles.discountInput}
                  placeholder="Enter discount"
                  value={discount}
                  onChangeText={setDiscount}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>
        )}

        {/* Reason Input Field */}
        {showReasonInput && (
          <View style={styles.discountInputContainer}>
            <View style={styles.discountInputRow}>
              <CommentIcon width={27} height={27} style={styles.discountAdjustmentIcon} />
              <CustomDropdown
                value={selectedReason}
                onChange={setSelectedReason}
                options={reasons}
                placeholder="Select Reason"
                onDropdownStateChange={setIsDropdownOpen}
              />
            </View>
          </View>
        )}

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

export default CancelBillModal; 