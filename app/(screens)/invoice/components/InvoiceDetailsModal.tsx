import React from 'react';
import { View, Text, StyleSheet, Image, Animated, PanResponder, TouchableOpacity } from 'react-native';

const formatAmount = (amount: number) => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

interface InvoiceDetailsModalProps {
  currentIndex: number;
  totalItems: number;
  details: {
    productName: string;
    quantity: number;
    uom: string;
    unitPrice: number;
    amount: number;
    discount_percentage: number;
  };
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

const InvoiceDetailsModal = ({
  currentIndex,
  totalItems,
  details,
  onSwipeLeft,
  onSwipeRight,
}: InvoiceDetailsModalProps) => {
  const pan = React.useRef(new Animated.ValueXY()).current;
  
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50 && currentIndex < totalItems && onSwipeLeft) {
          onSwipeLeft();
        } else if (gestureState.dx > 50 && onSwipeRight) {
          onSwipeRight();
        }
        
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <View style={styles.modalWrapper}>
      <Animated.View 
        style={[
          styles.container,
          {
            transform: [{ translateX: pan.x }]
          }
        ]}
        {...panResponder.panHandlers}
      >
        {currentIndex > 1 && (
          <TouchableOpacity 
            style={[styles.scrollIndicator, styles.leftIndicator]}
            onPress={onSwipeRight}
            activeOpacity={0.7}
          >
            <Image 
              source={require('../../../../assets/icons/Polygon.png')}
              style={[styles.scrollIcon, styles.leftIcon]}
            />
          </TouchableOpacity>
        )}

        {currentIndex < totalItems && (
          <TouchableOpacity 
            style={[styles.scrollIndicator, styles.rightIndicator]}
            onPress={onSwipeLeft}
            activeOpacity={0.7}
          >
            <Image 
              source={require('../../../../assets/icons/Polygon.png')}
              style={[styles.scrollIcon, styles.rightIcon]}
            />
          </TouchableOpacity>
        )}

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

        {/* Horizontal Separator */}
        <View style={styles.horizontalSeparator} />

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.label}>Quantity</Text>
              <Text style={styles.value}>{details.quantity}</Text>
            </View>
            <View style={styles.verticalSeparator} />
            <View style={styles.cell}>
              <Text style={styles.label}>UoM</Text>
              <Text style={styles.value}>{details.uom}</Text>
            </View>
            <View style={styles.verticalSeparator} />
            <View style={styles.cell}>
              <Text style={styles.label}>Unit Price</Text>
              <Text style={styles.value}>{formatAmount(details.unitPrice)}</Text>
            </View>
            <View style={styles.verticalSeparator} />
            <View style={styles.cell}>
              <Text style={styles.label}>Discount</Text>
              <Text style={styles.value}>
                {formatAmount(details.amount * (details.discount_percentage / 100))}
                <Text style={styles.discountPercentage}>
                  {` (${details.discount_percentage.toFixed(2)}%)`}
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Amount */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>TOTAL</Text>
          <View style={styles.amountRow}>
            <Text style={styles.amountValue}>{formatAmount(details.amount)}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginHorizontal: 0,
  },
  scrollIndicator: {
    position: 'absolute',
    zIndex: 1,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFAEB',
    borderRadius: 12,
    top: '50%',
    marginTop: -12,
  },
  leftIndicator: {
    left: 8,
  },
  rightIndicator: {
    right: 8,
  },
  scrollIcon: {
    width: 20,
    height: 20,
    tintColor: '#6B7280',
  },
  leftIcon: {
    transform: [{ rotate: '180deg' }],
  },
  rightIcon: {
    transform: [{ rotate: '0deg' }],
  },
  container: {
    backgroundColor: '#FFFAEB',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 16,
    marginTop: -8,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '85%',
    alignSelf: 'center',
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
  horizontalSeparator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  verticalSeparator: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
    height: '100%',
  },
  detailsGrid: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 4,
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
    fontSize: 18,
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
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currency: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  totalCurrency: {
    fontSize: 14,
    color: '#1F2937',
  },
});

export default InvoiceDetailsModal; 