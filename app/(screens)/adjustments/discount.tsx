import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DiscountAdjustmentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discount Adjustments</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
}); 