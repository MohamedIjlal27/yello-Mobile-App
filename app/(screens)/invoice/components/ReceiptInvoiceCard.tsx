import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import ShopIcon from '../../../../assets/icons/shopIcon.svg'
import CloseIcon from '../../../../assets/icons/close.svg'
import PayIcon from '../../../../assets/icons/pay.svg'
import LocationIcon from '../../../../assets/icons/location.svg'
import RedCloseIcon from '../../../../assets/icons/redClose.svg'
import styles from '@/app/styles/invoiceReceipt/styles';

interface ReceiptInvoiceCardProps {
  shopName: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  invoiceNumber: string;
  date: string;
  amount: number;
  onPay: () => void;
  onLocate: () => void;
  onPress?: () => void;
  onCancel?: () => void;
}

const formatAmount = (amount: number) => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const formatAddress = (address: ReceiptInvoiceCardProps['address']) => {
  const parts = [];
  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.postalCode) parts.push(address.postalCode);
  return parts.join(', ');
};

export default function ReceiptInvoiceCardProps({
  shopName,
  address,
  invoiceNumber,
  date,
  amount,
  onPay,
  onLocate,
  onPress,
  onCancel
}: ReceiptInvoiceCardProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      {/* Shop Info Section */}
      <View style={styles.shopSection}>
        <View style={styles.shopInfo}>
          <ShopIcon width={24} height={24} style={styles.shopIcon} />
          <View>
            <Text style={styles.shopName}>{shopName}</Text>
            <Text style={styles.address}>{formatAddress(address)}</Text>
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
              <RedCloseIcon width={27} height={27} style={styles.closeIcon} />
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
        <TouchableOpacity onPress={onPay} style={styles.payButton}>
          <PayIcon width={24} height={24} style={styles.payIcon} />
          <Text style={styles.payText}>P A Y</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
