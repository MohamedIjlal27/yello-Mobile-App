import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CancelledInvoicesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cancelled Invoices</Text>
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