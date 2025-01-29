import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import ShopIcon from '../../../../assets/icons/shopIcon.svg'
import CloseIcon from '../../../../assets/icons/close.svg'
import PayIcon from '../../../../assets/icons/pay.svg'
import LocationIcon from '../../../../assets/icons/location.svg'
import RedCloseIcon from '../../../../assets/icons/redClose.svg'
import styles from '@/app/styles/invoiceReceipt/styles';

interface AddressProps {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

interface InvoiceCardProps {
  shopName: string;
  address: AddressProps;
  invoiceNumber: string;
  date: string;
  amount: number;
  onPay: () => void;
  onLocate: () => void;
  onPress: () => void;
  onCancel: () => void;
}

const formatAmount = (amount: number) => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const InvoiceCard: React.FC<InvoiceCardProps> = ({
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
  const MAX_CHARS_PER_LINE = 30;

  const formatAddress = (address: AddressProps) => {
    // Filter out empty or undefined parts and remove duplicates
    const parts = [...new Set([
      address.street,
      address.city,
      address.state,
      address.postalCode
    ].filter(Boolean))];
    
    return (
      <Text style={styles.addressText}>
        {parts.map((part, index) => {
          if (part && part.length > MAX_CHARS_PER_LINE) {
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
              <RedCloseIcon width={27} height={27} style={styles.closeIcon} />
            </TouchableOpacity>
            <View>
              <Text style={styles.invoiceNumber}>{invoiceNumber}</Text>
              <Text style={styles.date}>{date}</Text>
            </View>
          </View>
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
};

export default InvoiceCard;
