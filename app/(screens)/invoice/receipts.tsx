import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CustomSearchBar from '../../../components/ui/CustomSearchBar';
import InvoiceCard from '../../../components/ui/InvoiceCard';
import InvoiceDetailsModal from './components/InvoiceDetailsModal';

// Demo data
const demoInvoices = [
  {
    id: '1',
    shopName: 'ASIRI PHARMACY',
    address: 'No:13, Panadura Road, Ingiriya',
    invoiceNumber: '24011655',
    date: '01-Jan-25',
    amount: 49582.25,
    products: [
      {
        id: '1',
        productName: 'GAL ADV MV CREAM 15GX144',
        quantity: 20,
        uom: 'Pcs',
        unitPrice: 3250.00,
        discount: 650.00,
        discountPercentage: 20.00,
        amount: 52000.00,
      },
      // Add more products as needed
    ]
  },
  {
    id: '2',
    shopName: 'NEW CITY PHARMACY',
    address: 'No:45, Main Street, Horana',
    invoiceNumber: '24011656',
    date: '01-Jan-25',
    amount: 32150.00,
  },
  {
    id: '3',
    shopName: 'CENTRAL PHARMACY',
    address: 'No:78, Hospital Road, Bandaragama',
    invoiceNumber: '24011657',
    date: '01-Jan-25',
    amount: 28975.50,
  },
];

export default function InvoiceReceiptsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const handleInvoicePress = (index: number) => {
    setSelectedInvoice(index);
    setSelectedProduct(0);
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <CustomSearchBar
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <ScrollView style={styles.scrollView}>
        {demoInvoices.map((invoice, index) => (
          <InvoiceCard
            key={invoice.id}
            shopName={invoice.shopName}
            address={invoice.address}
            invoiceNumber={invoice.invoiceNumber}
            date={invoice.date}
            amount={invoice.amount}
            onPay={handlePay}
            onLocate={handleLocate}
            onPress={() => handleInvoicePress(index)}
          />
        ))}
      </ScrollView>

      {selectedInvoice !== null && demoInvoices[selectedInvoice].products && (
        <InvoiceDetailsModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          currentIndex={selectedProduct + 1}
          totalItems={demoInvoices[selectedInvoice].products.length}
          details={demoInvoices[selectedInvoice].products[selectedProduct]}
        />
      )}
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