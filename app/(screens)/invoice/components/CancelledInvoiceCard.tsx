import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import ShopIcon from '../../../../assets/icons/shopIcon.svg'
import CashIcon from '../../../../assets/icons/cash.svg'
import PayIcon from '../../../../assets/icons/pay.svg'
import LocationIcon from '../../../../assets/icons/location.svg'
import styles from '@/app/styles/components/cancelInvoiceCard';

interface CancelledInvoiceCard {
  shopName: string;
  address: string;
  invoiceNumber: string;
  date?: string;
  amount: number;
  onPay: () => void;
  onLocate: () => void;
  onPress?: () => void;
  onCancel?: () => void;
}

const formatAmount = (amount: number) => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function CancelledInvoiceCard({
  shopName,
  address,
  invoiceNumber,
  date,
  amount,
  onPay,
  onLocate,
  onPress,
  onCancel
}: CancelledInvoiceCard) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      {/* Shop Info Section */}
      <View style={styles.shopSection}>
        <View style={styles.shopInfo}>
          <ShopIcon width={24} height={24} style={styles.shopIcon} />
          <View>
            <Text style={styles.shopName}>{shopName}</Text>
            <Text style={styles.address}>{address}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onLocate} style={styles.locateButton}>
          <LocationIcon width={24} height={24} style={styles.locateIcon} />
          <Text style={styles.locateText}>Locate</Text>
        </TouchableOpacity>
      </View>

      {/* Separator Line */}
      <View style={styles.separator} />

      {/* Invoice Info Section */}
      <View style={styles.invoiceSection}>
        <View style={styles.invoiceInfo}>
          <View style={styles.invoiceLeft}>
            <TouchableOpacity onPress={onCancel}>
              <CashIcon width={24} height={24} style={styles.CashIcon} />
            </TouchableOpacity>
            <View>
              <Text style={styles.invoiceNumber}>{invoiceNumber}</Text>
              <Text style={styles.date}>{date}</Text>
            </View>
          </View>
          <View style={styles.verticalSeparator} />
          <View style={styles.amountSection}>
            <Text style={styles.currency}>LKR</Text>
            <Text style={styles.amount}>{formatAmount(amount)}</Text>
          </View>
        </View>
        <View style={styles.payButton}>
          
          <Text style={styles.payText}>FULL</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

