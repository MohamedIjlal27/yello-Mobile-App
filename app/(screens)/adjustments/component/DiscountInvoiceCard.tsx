import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import ShopIcon from '../../../../assets/icons/shopIcon.svg'
import CashIcon from '../../../../assets/icons/cash.svg'
import PayIcon from '../../../../assets/icons/pay.svg'
import LocationIcon from '../../../../assets/icons/location.svg'
import styles from '@/app/styles/components/cancelInvoiceCard';
import { DemoCancelledOrder } from '@/utils/demoData';

interface DiscountInvoiceCardProps {
  invoice: DemoCancelledOrder;
  originalAmount?: number;
  onPay: () => void;
  onLocate: () => void;
  onPress?: () => void;
  onCancel?: () => void;
}

const formatAmount = (amount: number | undefined) => {
  if (amount === undefined || isNaN(amount)) {
    return "0.00";
  }
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const formatAddress = (address: string | undefined) => {
  if (!address) return 'N/A';
  
  // Split by common address delimiters
  const parts = address.split(/[,\n]/);
  
  // Clean and filter out empty parts
  return parts
    .map(part => part.trim())
    .filter(part => part.length > 0)
    .join('\n');
};

export default function DiscountInvoiceCard({
  invoice,
  originalAmount,
  onPay,
  onLocate,
  onPress,
  onCancel
}: DiscountInvoiceCardProps) {
  if (!invoice) {
    return null;
  }

  // Calculate the difference between original and current amount
  const discountAmount = originalAmount ? originalAmount - invoice.total_amount : undefined;

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={styles.card}
      activeOpacity={0.7}
    >
      {/* Shop Info Section */}
      <View style={styles.shopSection}>
        <View style={styles.shopInfo}>
          <ShopIcon width={24} height={24} style={styles.shopIcon} />
          <View style={styles.shopDetails}>
            <Text style={styles.shopName}>{invoice.customer?.name || 'N/A'}</Text>
            <Text style={styles.address}>{formatAddress(invoice.customer?.address)}</Text>
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
              <Text style={styles.invoiceNumber}>{invoice.order_number || 'N/A'}</Text>
              <Text style={styles.date}>{invoice.cancel_status || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.verticalSeparator} />
          <View style={styles.amountSection}>
            <View style={styles.amountRow}>
              <Text style={styles.currency}>LKR</Text>
              <Text style={styles.amount}>{formatAmount(invoice.total_amount)}</Text>
            </View>
            {discountAmount && discountAmount > 0 && (
              <View style={styles.discountRow}>
                <Text style={styles.discountCurrency}>LKR</Text>
                <Text style={styles.discountAmount}>({formatAmount(discountAmount)})</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.payButton}>
          <Text style={[
            styles.payText,
            { color: invoice.cancel_status?.toLowerCase() === 'partial' ? '#D3A900' : '#A01515' }
          ]}>{invoice.cancel_status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

