import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InvoiceReceiptsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invoice Receipts</Text>
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