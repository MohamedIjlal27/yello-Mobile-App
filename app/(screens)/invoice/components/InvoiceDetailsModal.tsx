import React from 'react';
import { View, Text, Image, Animated, PanResponder, TouchableOpacity } from 'react-native';
import styles from '@/app/styles/components/invoiceDetailsModal';

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

export default InvoiceDetailsModal; 