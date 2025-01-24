import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CustomSearchBar from '../../../components/ui/CustomSearchBar';
import InvoiceCard from '../../../components/ui/InvoiceCard';
import InvoiceDetailsModal from './components/InvoiceDetailsModal';
import CancelBillModal from './components/CancelBillModal';

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
      {
        id: '2',
        productName: 'PANADOL 500MG TAB 144S',
        quantity: 30,
        uom: 'Box',
        unitPrice: 1200.00,
        discount: 180.00,
        discountPercentage: 15.00,
        amount: 30600.00,
      },
      {
        id: '3',
        productName: 'VITAMIN C 500MG 100S',
        quantity: 15,
        uom: 'Box',
        unitPrice: 850.00,
        discount: 85.00,
        discountPercentage: 10.00,
        amount: 11475.00,
      },
      {
        id: '4',
        productName: 'BETADINE SOLUTION 500ML',
        quantity: 10,
        uom: 'Bottles',
        unitPrice: 1500.00,
        discount: 225.00,
        discountPercentage: 15.00,
        amount: 12750.00,
      }
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
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);

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

  const handleCancel = (index: number) => {
    setSelectedInvoice(index);
    setIsCancelModalVisible(true);
  };

  const handleProceedCancel = () => {
    // Implement cancel logic here
    setIsCancelModalVisible(false);
  };

  const handleDiscardCancel = () => {
    setIsCancelModalVisible(false);
    setSelectedInvoice(null);
  };

  const handleInvoicePress = (index: number) => {
    if (selectedInvoice === index && isModalVisible) {
      // If clicking the same invoice and modal is open, close it
      setIsModalVisible(false);
      setSelectedInvoice(null);
    } else {
      // If clicking a different invoice or modal is closed, open it
      setSelectedInvoice(index);
      setSelectedProduct(0);
      setIsModalVisible(true);
    }
  };

  const handleNextProduct = () => {
    if (selectedInvoice !== null && 
        demoInvoices[selectedInvoice].products && 
        selectedProduct < demoInvoices[selectedInvoice].products.length - 1) {
      setSelectedProduct(prev => prev + 1);
    }
  };

  const handlePreviousProduct = () => {
    if (selectedProduct > 0) {
      setSelectedProduct(prev => prev - 1);
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
              date={invoice.date}
              amount={invoice.amount}
              onPay={handlePay}
              onLocate={handleLocate}
              onPress={() => handleInvoicePress(index)}
              onCancel={() => handleCancel(index)}
            />
            {selectedInvoice === index && invoice.products && isModalVisible && (
              <InvoiceDetailsModal
                currentIndex={selectedProduct + 1}
                totalItems={invoice.products.length}
                details={invoice.products[selectedProduct]}
                onSwipeLeft={handleNextProduct}
                onSwipeRight={handlePreviousProduct}
              />
            )}
          </React.Fragment>
        ))}
      </ScrollView>

      {selectedInvoice !== null && isCancelModalVisible && (
        <CancelBillModal
          invoiceNo={demoInvoices[selectedInvoice].invoiceNumber}
          customer={demoInvoices[selectedInvoice].shopName}
          amount={demoInvoices[selectedInvoice].amount}
          onProceed={handleProceedCancel}
          onDiscard={handleDiscardCancel}
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