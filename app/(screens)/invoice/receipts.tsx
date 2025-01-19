import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CustomSearchBar from '../../../components/ui/CustomSearchBar';
import InvoiceCard from '../../../components/ui/InvoiceCard';

export default function InvoiceReceiptsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Implement search logic here
  };

  const handlePay = () => {
    // Implement payment logic
  };

  const handleLocate = () => {
    // Implement location logic
  };

  return (
    <View style={styles.container}>
      <CustomSearchBar
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <ScrollView style={styles.scrollView}>
        <InvoiceCard
          shopName="ASIRI PHARMACY"
          address="No:13, Panadura Road, Ingiriya"
          invoiceNumber="24011655"
          date="01-Jan-25"
          amount={49582.25}
          onPay={handlePay}
          onLocate={handleLocate}
        />
        {/* Add more InvoiceCard components as needed */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
}); 