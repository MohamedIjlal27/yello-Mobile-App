import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomSearchBar from '../../../components/ui/CustomSearchBar';

export default function InvoiceReceiptsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Implement search logic here
  };

  return (
    <View style={styles.container}>
      <CustomSearchBar
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {/* Rest of your content will go here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
}); 