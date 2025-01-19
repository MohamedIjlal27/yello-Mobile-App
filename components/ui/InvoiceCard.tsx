import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface InvoiceCardProps {
  shopName: string;
  address: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  onPay?: () => void;
  onLocate?: () => void;
}

export default function InvoiceCard({
  shopName,
  address,
  invoiceNumber,
  date,
  amount,
  onPay,
  onLocate
}: InvoiceCardProps) {
  return (
    <View style={styles.card}>
      {/* Shop Info Section */}
      <View style={styles.shopSection}>
        <View style={styles.shopInfo}>
          <Image 
            source={require('../../assets/icons/shop.png')}
            style={styles.shopIcon}
          />
          <View>
            <Text style={styles.shopName}>{shopName}</Text>
            <Text style={styles.address}>{address}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onLocate} style={styles.locateButton}>
          <Image 
            source={require('../../assets/icons/locate.png')}
            style={styles.locateIcon}
            resizeMode="contain"
          />
          <Text style={styles.locateText}>Locate</Text>
        </TouchableOpacity>
      </View>

      {/* Invoice Info Section */}
      <View style={styles.invoiceSection}>
        <View style={styles.invoiceInfo}>
          <View style={styles.invoiceLeft}>
            <Image 
              source={require('../../assets/icons/close.png')}
              style={styles.closeIcon}
            />
            <View>
              <Text style={styles.invoiceNumber}>{invoiceNumber}</Text>
              <Text style={styles.date}>{date}</Text>
            </View>
          </View>
          <View style={styles.amountSection}>
            <Text style={styles.currency}>LKR</Text>
            <Text style={styles.amount}>{amount.toFixed(2)}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onPay} style={styles.payButton}>
          <Text style={styles.payText}>P A Y</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
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
    marginBottom: 16,
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
    fontWeight: 'bold',
    color: '#324F5D',
  },
  address: {
    fontSize: 14,
    color: '#666666',
  },
  locateButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locateIcon: {
    width: 22,
    height: 22,
    marginRight: 4,
  },
  locateText: {
    color: '#324F5D',
    fontWeight: '500',
    fontSize: 16,
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
  },
  invoiceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  date: {
    fontSize: 14,
    color: '#666666',
  },
  amountSection: {
    alignItems: 'flex-end',
  },
  currency: {
    fontSize: 14,
    color: '#666666',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  payButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  payText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 