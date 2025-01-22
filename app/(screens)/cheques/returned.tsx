import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ReturnedChequesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Returned Cheques</Text>
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