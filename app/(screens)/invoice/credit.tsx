import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import InvoiceCard from './components/CreditInvoiceCard';
import CustomSearchBar from '@/components/ui/CustomSearchBar';


const demoInvoices = [
  {
    id: '1',
    shopName: 'ASIRI PHARMACY',
    address: 'No:13, Panadura Road, Ingiriya',
    invoiceNumber: '24011655',
    date: '01-Jan-25',
    amount: 49582.25,
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


export default function CreditInvoicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isPayModalVisible, setIsPayModalVisible] = useState(false);

  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);


  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Implement search logic here
  };

  const handlePay = (index: number) => {
    setSelectedInvoice(index);
    setIsPayModalVisible(true);
  };

  const handleLocate = () => {
    // Implement location logic
  };

  const handleCancel = (index: number) => {
    setSelectedInvoice(index);
    setIsCancelModalVisible(true);
  };

  const handleInvoicePress = (index: number) => {
    if (selectedInvoice === index && isModalVisible) {
      setIsModalVisible(false);
      setSelectedInvoice(null);
    } else {
      setSelectedInvoice(index);
      setSelectedProduct(0);
      setIsModalVisible(true);
    }
  };
  return (
    <View style={styles.container}>
      <CustomSearchBar
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <ScrollView style={styles.scrollView}>
        {demoInvoices.map((invoice, index) => (
          <React.Fragment key={invoice.id}>
            <InvoiceCard
              shopName={invoice.shopName}
              address={invoice.address}
              invoiceNumber={invoice.invoiceNumber}
              amount={invoice.amount}
              onPay={() => handlePay(index)}
              onLocate={handleLocate}
              onPress={() => handleInvoicePress(index)}
              onCancel={() => handleCancel(index)}
            />
          </React.Fragment>
        ))}
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