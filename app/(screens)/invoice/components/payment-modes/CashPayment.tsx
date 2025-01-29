import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import DenominationIcon from '../../../../../assets/icons/denomination.svg';
import styles from '@/app/styles/components/recordPaymentMethod';

interface CashPaymentProps {
  paymentAmount: string;
  setPaymentAmount: (amount: string) => void;
}

export default function CashPayment({ paymentAmount, setPaymentAmount }: CashPaymentProps) {
  return (
    <View style={styles.amountContainer}>
      <Text style={styles.amountLabel}>Amount</Text>
      <View style={styles.amountInputWrapper}>
        <View style={styles.amountInputContainer}>
          <Text style={styles.currencyLabel}>LKR</Text>
          <TextInput
            style={styles.amountInput}
            value={paymentAmount}
            onChangeText={setPaymentAmount}
            keyboardType="numeric"
            placeholder="0.00"
          />
        </View>
        <TouchableOpacity style={styles.denominationButton}>
          <DenominationIcon width={24} height={24} fill="#374151" />
          <Text style={styles.denominationText}>Denomination</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 