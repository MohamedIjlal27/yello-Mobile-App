import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text, RefreshControl, Alert } from 'react-native';
import CustomSearchBar from '../../../components/ui/CustomSearchBar';
import InvoiceCard from './components/CreditInvoiceCard';
import InvoiceDetailsModal from './components/InvoiceDetailsModal';
import UploadInvoiceModal from './components/UploadInvoiceModal';
import CancelBillModal from './components/CancelBillModal';
import RecordPaymentModal from './components/RecordPaymentModal';
import { fetchInvoiceReceipts, Order } from '../../../api/endpoints';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../store/store';
import { setOrderId } from '../../../store/userSlice';
import { getUploadedInvoices, markInvoiceAsUploaded, isInvoiceUploaded, initDatabase } from '../../../store/database';
import styles from '@/app/styles/invoiceReceipt/styles';

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function CreditInvoicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPayModalVisible, setIsPayModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadedInvoices, setUploadedInvoices] = useState<Set<number>>(new Set());
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.userId);

  // Separate database initialization
  useEffect(() => {
    const initDb = () => {
      try {
        initDatabase();
      } catch (error) {
        console.error('Database initialization error:', error);
        setError('Failed to initialize database');
      }
    };
    initDb();
  }, []);

  // Separate data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load uploaded invoices
        const uploaded = getUploadedInvoices();
        setUploadedInvoices(uploaded);
        
        // Load invoice receipts
        await loadInvoiceReceipts();
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const loadInvoiceReceipts = async () => {
    try {
      setError(null);
      const today = formatDate(new Date());
      const response = await fetchInvoiceReceipts({ 
        salesperson_id: userId, 
        date: today
      });
      
      if (response.result && response.result.orders) {
        setOrders(response.result.orders);
      } else {
        setError('No orders found in the response');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load invoices');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadInvoiceReceipts();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Implement search logic here
  };

  const handlePay = (index: number) => {
    try {
      const order = orders[index];
      if (!isInvoiceUploaded(order.order_id)) {
        // Show upload invoice modal if invoice hasn't been uploaded
        setSelectedInvoice(index);
        dispatch(setOrderId(order.order_id.toString()));
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
    dispatch(setOrderId(orders[index].order_id.toString()));
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
        orders[selectedInvoice].order_lines && 
        selectedProduct < orders[selectedInvoice].order_lines.length - 1) {
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
        const orderId = orders[selectedInvoice].order_id;
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
        const orderId = orders[selectedInvoice].order_id;
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
    <View style={styles.container}>
      <CustomSearchBar
        value={searchQuery}
        onChangeText={handleSearch}
      />
      
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading invoices...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.noDataText}>No invoices found</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#FF0000"]} // Android
              tintColor="#FF0000" // iOS
            />
          }
        >
          {orders.map((order, index) => (
            <React.Fragment key={order.order_number}>
              <InvoiceCard
                shopName={order.customer.name}
                address={{
                  street: order.customer.address?.split(',')[0]?.trim() || '',
                  city: order.customer.address?.split(',')[1]?.trim() || '',
                  state: order.customer.address?.split(',')[2]?.trim() || '',
                  postalCode: order.customer.address?.split(',')[3]?.trim() || ''
                }}
                invoiceNumber={order.order_number.toString()}
                date={new Date(order.order_date).toLocaleDateString()}
                amount={order.total_amount}
                onPay={() => handlePay(index)}
                onLocate={handleLocate}
                onPress={() => handleInvoicePress(index)}
                onCancel={() => handleCancel(index)}
              />
              {selectedInvoice === index && order.order_lines && isModalVisible && (
                <InvoiceDetailsModal
                  currentIndex={selectedProduct + 1}
                  totalItems={order.order_lines.length}
                  details={{
                    productName: order.order_lines[selectedProduct].product_name.en_US,
                    quantity: order.order_lines[selectedProduct].quantity,
                    uom: order.order_lines[selectedProduct].uom.en_US,
                    unitPrice: order.order_lines[selectedProduct].unit_price,
                    amount: order.order_lines[selectedProduct].line_amount,
                    discount_percentage: order.order_lines[selectedProduct].discount_percentage
                  }}
                  onSwipeLeft={handleNextProduct}
                  onSwipeRight={handlePreviousProduct}
                />
              )}
            </React.Fragment>
          ))}
        </ScrollView>
      )}

      {selectedInvoice !== null && isPayModalVisible && (
        <UploadInvoiceModal
          shopName={orders[selectedInvoice].customer.name}
          paymentType="Cash"
          dueDate="21 Days"
          amount={orders[selectedInvoice].total_amount}
          orderId={orders[selectedInvoice].order_id}
          onClose={handleClosePayModal}
          onUpload={handleUploadInvoice}
          onAcceptPayment={handleAcceptPayment}
        />
      )}

      {selectedInvoice !== null && showRecordPayment && (
        <RecordPaymentModal
          visible={showRecordPayment}
          shopName={orders[selectedInvoice].customer.name}
          dueDate="21 Days"
          amount={orders[selectedInvoice].total_amount}
          orderId={orders[selectedInvoice].order_id}
          onClose={() => {
            setShowRecordPayment(false);
            setSelectedInvoice(null);
          }}
          onSubmit={(paymentType, amount, additionalData) => {
            // Handle payment submission
            setShowRecordPayment(false);
            setSelectedInvoice(null);
          }}
        />
      )}

      {selectedInvoice !== null && isCancelModalVisible && (
        <CancelBillModal
          invoiceNo={orders[selectedInvoice].order_number.toString()}
          customer={orders[selectedInvoice].customer.name}
          amount={orders[selectedInvoice].total_amount}
          onProceed={handleProceedCancel}
          onDiscard={handleDiscardCancel}
          onRefresh={loadInvoiceReceipts}
        />
      )}
    </View>
  );
}


