import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import ShopIcon from '../../../../assets/icons/shopIcon.svg'
import CloseIcon from '../../../../assets/icons/close.svg'
import PayIcon from '../../../../assets/icons/pay.svg'
import LocationIcon from '../../../../assets/icons/location.svg'
import RedCloseIcon from '../../../../assets/icons/redClose.svg'

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

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E9E6E6FF',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shopSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#324F5D',
    fontFamily: 'Assistant',
  },
  address: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'Assistant',
    fontWeight: '400',
    marginTop: 2,
    maxWidth: '80%',
  },
  locateButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locateIcon: {
    width: 14,
    height: 18,
    marginRight: 2,
  },
  locateText: {
    color: '#324F5D',
    fontWeight: '500',
    fontSize: 14,
  },
  invoiceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 16,
    height: 50,
  },
  invoiceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeIcon: {
    width: 30,
    height: 30,
    marginRight: 6,
    left: 0,
  },
  invoiceNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
    fontFamily: 'Assistant',
  },
  date: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Assistant',
    fontWeight: '500',
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  currency: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Assistant',
  },
  amount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000000',
    fontFamily: 'Assistant',
  },
  payButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  payIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: '#FFFFFF',
  },
  payText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#BDBCBCFF',
    marginVertical: 1,
    width: '72%',
  },
  verticalSeparator: {
    width: 1,
    height: '100%',
    backgroundColor: '#BDBCBCFF',
    marginHorizontal: 16,
  },
}); 