import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';

interface InvoiceDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  currentIndex: number;
  totalItems: number;
  details: {
    productName: string;
    quantity: number;
    uom: string;
    unitPrice: number;
    discount: number;
    discountPercentage: number;
    amount: number;
  };
}

const InvoiceDetailsModal = ({
  visible,
  onClose,
  currentIndex,
  totalItems,
  details,
}: InvoiceDetailsModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.productIcon}>
              <Image 
                source={require('../../../../assets/icons/product.png')}
                style={styles.icon}
              />
            </View>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Product</Text>
              <Text style={styles.itemCount}>{currentIndex}/{totalItems}</Text>
            </View>
          </View>

          {/* Product Name */}
          <Text style={styles.productName}>{details.productName}</Text>

          {/* Details Grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.label}>Quantity</Text>
                <Text style={styles.value}>{details.quantity}</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.label}>UoM</Text>
                <Text style={styles.value}>{details.uom}</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.label}>Unit Price</Text>
                <Text style={styles.value}>{details.unitPrice.toFixed(2)}</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.label}>Discount</Text>
                <Text style={styles.value}>
                  {details.discount.toFixed(2)}
                  <Text style={styles.discountPercentage}>
                    {` (${details.discountPercentage.toFixed(2)}%)`}
                  </Text>
                </Text>
              </View>
            </View>
          </View>

          {/* Amount */}
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amountValue}>{details.amount.toFixed(2)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  productIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    width: 24,
    height: 24,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
  },
  itemCount: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 16,
    fontFamily: 'Inter',
  },
  detailsGrid: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    flex: 1,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontFamily: 'Inter',
  },
  value: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  discountPercentage: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  amountContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  amountValue: {
    fontSize: 18,
    color: '#1F2937',
    fontWeight: '600',
    fontFamily: 'Inter',
  },
});

export default InvoiceDetailsModal; 