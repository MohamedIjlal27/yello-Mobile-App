import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import ShopIcon from '../../../../assets/icons/shopIcon.svg'
import CashIcon from '../../../../assets/icons/cash.svg'
import PayIcon from '../../../../assets/icons/pay.svg'
import LocationIcon from '../../../../assets/icons/location.svg'
import styles from '@/app/styles/components/creditInvoiceCard';

interface AddressProps {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

interface CreditInvoiceCard {
  shopName: string;
  address: AddressProps;
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

const CreditInvoiceCard: React.FC<CreditInvoiceCard> = ({
  shopName,
  address,
  invoiceNumber,
  date,
  amount,
  onPay,
  onLocate,
  onPress,
  onCancel,
}) => {
  console.log('CreditInvoiceCard Props:', {
    shopName,
    address,
    invoiceNumber,
    date,
    amount
  });

  const MAX_CHARS_PER_LINE = 30;

  const formatAddress = (address: AddressProps) => {
    console.log('Formatting address:', address);
    // Filter out empty or undefined parts and remove duplicates
    const parts = [...new Set([
      address.street,
      address.city,
      address.state,
      address.postalCode
    ].filter(Boolean))];
    
    console.log('Formatted address parts:', parts);
    
    return (
      <Text style={styles.addressText}>
        {parts.map((part, index) => {
          if (!part) return '';
          if (part.length > MAX_CHARS_PER_LINE) {
            const lines = part.match(new RegExp(`.{1,${MAX_CHARS_PER_LINE}}`, 'g')) || [part];
            return lines.map((line, lineIndex) => 
              `${line.trim()}${(lineIndex < lines.length - 1 || index < parts.length - 1) ? '\n' : ''}`
            ).join('');
          }
          return `${part}${index < parts.length - 1 ? '\n' : ''}`;
        }).join('')}
      </Text>
    );
  };

  if (!shopName || !invoiceNumber) {
    console.log('Missing required props:', { shopName, invoiceNumber });
    return null;
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Shop Info Section */}
      <View style={styles.shopSection}>
        <View style={styles.shopInfo}>
          <ShopIcon width={24} height={24} style={styles.shopIcon} />
          <View style={styles.shopDetailsContainer}>
            <Text style={styles.shopName}>{shopName}</Text>
            <View style={styles.address}>
              {formatAddress(address)}
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.locateButton} onPress={onLocate}>
          <LocationIcon width={14} height={18} style={styles.locateIcon} />
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
              <CashIcon width={27} height={27} style={styles.closeIcon} />
            </TouchableOpacity>
            <View>
              <Text style={styles.invoiceNumber}>{invoiceNumber}</Text>
              <Text style={styles.date}>{date || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.amountSection}>
            <Text style={styles.currency}>LKR</Text>
            <Text style={styles.amount}>{formatAmount(amount || 0)}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onPay} style={styles.payButton}>
          <PayIcon width={24} height={24} style={styles.payIcon} />
          <Text style={styles.payText}>P A Y</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default CreditInvoiceCard;