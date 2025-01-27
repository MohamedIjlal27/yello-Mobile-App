import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store/store';
import Toast from 'react-native-toast-message';
import WarningIcon from '../../../../assets/icons/warning.svg';
import CancelIcon from '../../../../assets/icons/cancel.svg';
import DiscountIcon from '../../../../assets/icons/discount.svg';
import CheckIcon from '../../../../assets/icons/check.svg';
import CloseIcon from '../../../../assets/icons/close.svg';
import DiscountAdjustmentIcon from '../../../../assets/icons/discountAdjustment.svg';
import CommentIcon from '../../../../assets/icons/comments.svg';
import CustomDropdown from '../../../../components/ui/CustomDropdown';
import { applyDiscountAdjustment } from '../../../../api/endpoints';
import styles from '../../../styles/components/cancelBillModal';

interface CancelBillModalProps {
  invoiceNo: string;
  customer: string;
  amount: number;
  onProceed: () => void;
  onDiscard: () => void;
  onRefresh: () => void;
}

type SelectedOption = 'cancel' | 'discount' | null;

const formatAmount = (amount: number) => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const CancelBillModal = ({
  invoiceNo,
  customer,
  amount,
  onProceed,
  onDiscard,
  onRefresh,
}: CancelBillModalProps) => {
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [discount, setDiscount] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectedOption>(null);
  const reasonInputRef = useRef(null);
  const userId = useSelector((state: RootState) => state.user.userId);
  const orderId = useSelector((state: RootState) => state.user.orderId);

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
    setSelectedOption('discount');
  };

  const handleCancelBillPress = () => {
    setShowDiscountInput(true);
    setShowReasonInput(true);
    setSelectedOption('cancel');
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
            style={[
              styles.actionButton,
              selectedOption === 'cancel' && styles.selectedActionButton
            ]}
            onPress={handleCancelBillPress}
          >
            <CancelIcon width={20} height={20} fill={selectedOption === 'cancel' ? '#EF4444' : '#374151'} />
            <Text style={[
              styles.buttonText,
              selectedOption === 'cancel' && styles.selectedButtonText
            ]}>Cancel Bill</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.actionButton,
              selectedOption === 'discount' && styles.selectedActionButton
            ]}
            onPress={handleDiscountPress}
          >
            <DiscountIcon width={20} height={20} fill={selectedOption === 'discount' ? '#EF4444' : '#374151'} />
            <Text style={[
              styles.buttonText,
              selectedOption === 'discount' && styles.selectedButtonText
            ]}>Discount Adjustment</Text>
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
                  placeholder={showReasonInput ? "Enter Amount" : "Enter Discount Amount"}
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
            onPress={async () => {
              try {
                if (!discount) {
                  Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Discount amount is required'
                  });
                  return;
                }

                if (selectedOption === 'cancel' && (!selectedReason || selectedReason === 'Select Reason')) {
                  Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Please select a reason for cancellation'
                  });
                  return;
                }

                const requestParams = {
                  type: selectedOption === 'cancel' ? 'cancel' as const : 'adjustment' as const,
                  salesperson_id: userId.toString(),
                  sales_order_id: orderId,
                  description: selectedOption === 'cancel' ? 
                    (selectedReason && selectedReason !== 'Select Reason' ? selectedReason : '') : 
                    'Discount Adjustment',
                  value: discount
                };
                
                await applyDiscountAdjustment(requestParams);
                Toast.show({
                  type: 'success',
                  text1: selectedOption === 'cancel' ? 'Bill Cancelled' : 'Discount Added',
                  text2: `${selectedOption === 'cancel' ? 'Cancel Bill' : 'Discount Adjustment'} of ${selectedOption === 'cancel' ? '-' : '+'}LKR ${formatAmount(parseFloat(discount))} applied to invoice ${invoiceNo}`
                });
                onRefresh();
                onProceed();
              } catch (error) {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: error instanceof Error ? error.message : 'Failed to process request'
                });
              }
            }}
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



export default CancelBillModal; 