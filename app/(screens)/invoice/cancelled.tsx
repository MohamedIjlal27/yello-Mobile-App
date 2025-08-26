import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import InvoiceCard from './components/CancelledInvoiceCard';
import CustomSearchBar from '@/components/ui/CustomSearchBar';
import styles from '@/app/styles/cancelled/styles';
import { demoCancelledInvoices, demoInvoiceReceipts, DemoCancelledOrder, DemoOrder } from '@/utils/demoData';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function CancelledInvoicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPayModalVisible, setIsPayModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [invoices, setInvoices] = useState<DemoCancelledOrder[]>([]);
  const [receipts, setReceipts] = useState<DemoOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = useSelector((state: RootState) => state.user.userId);

  const loadData = async () => {
    if (!userId) {
      setError('User ID is required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const today = formatDate(new Date());

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use demo data
      const cancelledResponse = demoCancelledInvoices;
      const receiptsResponse = demoInvoiceReceipts;

      if (receiptsResponse?.result?.orders) {
        setReceipts(receiptsResponse.result.orders);
      }

      if (cancelledResponse?.result?.orders && Array.isArray(cancelledResponse.result.orders)) {
        setInvoices(cancelledResponse.result.orders);
        if (cancelledResponse.result.orders.length === 0) {
          setError('No cancelled invoices found for today');
        }
      } else {
        setInvoices([]);
        console.error('Invalid response structure:', cancelledResponse);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cancelled invoices');
      console.error('Error loading data:', err);
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  const getOriginalAmount = (orderNumber: string): number | undefined => {
    const receipt = receipts.find(r => r.order_number.toString() === orderNumber);
    return receipt?.total_amount;
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      loadData();
      return;
    }

    const filteredInvoices = invoices.filter(invoice => 
      invoice.customer.name.toLowerCase().includes(text.toLowerCase()) ||
      invoice.order_number.toLowerCase().includes(text.toLowerCase())
    );
    setInvoices(filteredInvoices);
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (!invoices || invoices.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No cancelled invoices for today</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.scrollView}>
        {invoices.map((invoice, index) => (
          <InvoiceCard
            key={`${invoice.order_id}-${invoice.total_amount}`}
            invoice={invoice}
            originalAmount={getOriginalAmount(invoice.order_number)}
            onPay={() => handlePay(index)}
            onLocate={handleLocate}
            onPress={() => handleInvoicePress(index)}
            onCancel={() => handleCancel(index)}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <CustomSearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search by shop name or invoice number"
      />
      {renderContent()}
    </View>
  );
}

