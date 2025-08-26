import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text, RefreshControl, Alert } from 'react-native';
import CustomSearchBar from '../../../components/ui/CustomSearchBar';
import InvoiceCard from './components/CreditInvoiceCard';
import InvoiceDetailsModal from './components/InvoiceDetailsModal';
import UploadInvoiceModal from './components/UploadInvoiceModal';
import CancelBillModal from './components/CancelBillModal';
import RecordPaymentModal from './components/RecordPaymentModal';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../store/store';
import { setOrderId } from '../../../store/userSlice';
import { getUploadedInvoices, markInvoiceAsUploaded, isInvoiceUploaded, initDatabase } from '../../../store/database';
import styles from '@/app/styles/invoiceReceipt/styles';
import { demoCreditInvoices } from '../../../utils/demoData';

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Add function to format invoice number
const formatInvoiceNumber = (invoiceId: string): string => {
  // Remove 'INV/' prefix and any leading/trailing whitespace
  return invoiceId.replace(/^INV\/?/i, '').trim();
};

export default function CreditInvoicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPayModalVisible, setIsPayModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [creditInvoices, setCreditInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadedInvoices, setUploadedInvoices] = useState<Set<number>>(new Set());
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.userId);



  // Updated data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        

        
        // Load uploaded invoices
        const uploaded = getUploadedInvoices();
        setUploadedInvoices(uploaded);
        
        // Load credit invoices
        await loadCreditInvoices();
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const loadCreditInvoices = async () => {
    try {
      setError(null);
      console.log('Debug - userId from Redux:', userId);
      console.log('Debug - userId type:', typeof userId);

      if (!userId) {
        setError('User ID not found. Please login again.');
        setLoading(false);
        return;
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = demoCreditInvoices;
      
      console.log('Credit Invoices Full Response:', response);

      if (response.result) {
        if (Array.isArray(response.result.orders)) {
          console.log('Credit Invoices Data:', response.result.orders);
          setCreditInvoices(response.result.orders);
          if (response.result.orders.length === 0) {
            setError('No credit invoices available');
          }
        } else {
          console.log('Invalid credit_invoices format:', response.result.orders);
          setCreditInvoices([]);
          setError('No credit invoices available');
        }
      } else {
        console.log('Invalid response format:', response);
        setCreditInvoices([]);
        setError('No credit invoices available');
      }
    } catch (error) {
      console.error('Credit Invoices Error:', error);
      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          setError('Unable to connect to server. Please check your internet connection and try again.');
        } else {
          setError(`Unable to load credit invoices: ${error.message}`);
        }
      } else {
        setError('Unable to load credit invoices. Please try again later.');
      }
      setCreditInvoices([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadCreditInvoices();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Implement search logic here
  };

  const handlePay = (index: number) => {
    try {
      const invoice = creditInvoices[index];
      if (!isInvoiceUploaded(invoice.inv_ref)) {
        // Show upload invoice modal if invoice hasn't been uploaded
        setSelectedInvoice(index);
        dispatch(setOrderId(invoice.inv_ref.toString()));
        setIsPayModalVisible(true);
      } else {
        // Show record payment modal if invoice has been uploaded
        setSelectedInvoice(index);
        setShowRecordPayment(true);
      }
    } catch (error) {
      console.error('Error in handlePay:', error);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    }
  };

  const handleLocate = () => {
    // Implement location logic
  };

  const handleCancel = (index: number) => {
    setSelectedInvoice(index);
    dispatch(setOrderId(creditInvoices[index].inv_ref.toString()));
    setIsCancelModalVisible(true);
  };

  const handleProceedCancel = () => {
    dispatch(setOrderId(''));
    setIsCancelModalVisible(false);
  };

  const handleDiscardCancel = () => {
    dispatch(setOrderId(''));
    setIsCancelModalVisible(false);
    setSelectedInvoice(null);
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

  const handleNextProduct = () => {
    if (selectedInvoice !== null && 
        creditInvoices[selectedInvoice].order_lines && 
        selectedProduct < creditInvoices[selectedInvoice].order_lines.length - 1) {
      setSelectedProduct(prev => prev + 1);
    }
  };

  const handlePreviousProduct = () => {
    if (selectedProduct > 0) {
      setSelectedProduct(prev => prev - 1);
    }
  };

  const handleClosePayModal = () => {
    dispatch(setOrderId(''));
    setIsPayModalVisible(false);
    setSelectedInvoice(null);
  };

  const handleUploadInvoice = () => {
    try {
      if (selectedInvoice !== null) {
        const orderId = creditInvoices[selectedInvoice].inv_ref;
        markInvoiceAsUploaded(orderId);
        setUploadedInvoices(prev => new Set([...prev, orderId]));
      }
    } catch (error) {
      console.error('Error in handleUploadInvoice:', error);
      Alert.alert('Error', 'Failed to mark invoice as uploaded.');
    }
  };

  const handleAcceptPayment = () => {
    try {
      if (selectedInvoice !== null) {
        const orderId = creditInvoices[selectedInvoice].inv_ref;
        markInvoiceAsUploaded(orderId);
        setUploadedInvoices(prev => new Set([...prev, orderId]));
        setIsPayModalVisible(false);
        setShowRecordPayment(true);
      }
    } catch (error) {
      console.error('Error in handleAcceptPayment:', error);
      Alert.alert('Error', 'Failed to process payment acceptance.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      {console.log('Credit Invoices State:', creditInvoices)}
      {console.log('Loading State:', loading)}
      {console.log('Error State:', error)}
      <CustomSearchBar
        value={searchQuery}
        onChangeText={handleSearch}
      />
      
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading credit invoices...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : creditInvoices.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.noDataText}>No credit invoices found</Text>
        </View>
      ) : (
        <ScrollView 
          style={[styles.scrollView, { flex: 1 }]}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#FF0000"]}
              tintColor="#FF0000"
            />
          }
        >
          {creditInvoices.map((invoice, index) => {
            console.log('Rendering invoice:', invoice);

            // Add safety check for invoice object
            if (!invoice) {
              console.log('Invalid invoice data at index', index, invoice);
              return null;
            }

            // Create a customer object that matches the expected structure
            const customer = {
              name: invoice.cus_name,
              address: invoice.cus_addr
            };

            return (
              <View key={invoice.inv_id || index} style={{ marginBottom: 10 }}>
                <InvoiceCard
                  shopName={invoice.cus_name || 'N/A'}
                  address={{
                    street: invoice.cus_addr || 'N/A',
                    city: '',
                    state: '',
                    postalCode: ''
                  }}
                  invoiceNumber={formatInvoiceNumber(invoice.inv_id || 'N/A')}
                  date={invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : 'N/A'}
                  amount={invoice.amount_total || 0}
                  onPay={() => handlePay(index)}
                  onLocate={handleLocate}
                  onPress={() => handleInvoicePress(index)}
                  onCancel={() => handleCancel(index)}
                />
              </View>
            );
          })}
        </ScrollView>
      )}

      {selectedInvoice !== null && isPayModalVisible && creditInvoices[selectedInvoice] && (
        <UploadInvoiceModal
          shopName={creditInvoices[selectedInvoice].cus_name || 'N/A'}
          paymentType="Cash"
          dueDate="21 Days"
          amount={creditInvoices[selectedInvoice].amount_total || 0}
          orderId={creditInvoices[selectedInvoice].inv_ref}
          onClose={handleClosePayModal}
          onUpload={handleUploadInvoice}
          onAcceptPayment={handleAcceptPayment}
        />
      )}

      {selectedInvoice !== null && showRecordPayment && creditInvoices[selectedInvoice] && (
        <RecordPaymentModal
          visible={showRecordPayment}
          shopName={creditInvoices[selectedInvoice].cus_name || 'N/A'}
          dueDate="21 Days"
          amount={creditInvoices[selectedInvoice].amount_total || 0}
          orderId={creditInvoices[selectedInvoice].inv_ref}
          onClose={() => {
            setShowRecordPayment(false);
            setSelectedInvoice(null);
          }}
          onSubmit={(paymentType, amount, additionalData) => {
            setShowRecordPayment(false);
            setSelectedInvoice(null);
          }}
        />
      )}

      {selectedInvoice !== null && isCancelModalVisible && creditInvoices[selectedInvoice] && (
        <CancelBillModal
          invoiceNo={creditInvoices[selectedInvoice].inv_id || 'N/A'}
          customer={creditInvoices[selectedInvoice].cus_name || 'N/A'}
          amount={creditInvoices[selectedInvoice].amount_total || 0}
          onProceed={handleProceedCancel}
          onDiscard={handleDiscardCancel}
          onRefresh={loadCreditInvoices}
        />
      )}
    </View>
  );
}


