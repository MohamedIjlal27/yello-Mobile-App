import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import MenuItem from '../../components/ui/MenuItem';
import ImageUploadModal from '../(screens)/upload/ImageUploadModal';

export default function MenuScreen() {
  const [isImageUploadModalVisible, setImageUploadModalVisible] = useState(false);

  const handleNavigation = (screen: string) => {
    router.push(screen as any); // Type assertion needed for now
  };

  const handleImageUploadPress = () => {
    setImageUploadModalVisible(true);
  };

  const handleGallerySelect = () => {
    setImageUploadModalVisible(false);
    // Navigate to gallery upload screen
    handleNavigation('/(screens)/upload/gallery');
  };

  const handleBankSlipSelect = () => {
    setImageUploadModalVisible(false);
    // Navigate to bank slip upload screen
    handleNavigation('/(screens)/upload/bank-slip');
  };

  return (
    <View style={styles.container}>
      {/* Menu Grid */}
      <View style={styles.menuGrid}>
        <MenuItem 
          iconImage={require('../../assets/icons/invoiceReceipt.png')} 
          topText="Invoice"
          bottomText="Receipts"
          onPress={() => handleNavigation('/(screens)/invoice/receipts')}
        />
        <MenuItem 
          iconImage={require('../../assets/icons/cancelledInvoice.png')} 
          topText="Cancelled"
          bottomText="Invoices"
          onPress={() => handleNavigation('/(screens)/invoice/cancelled')}
        />
        <MenuItem 
          iconImage={require('../../assets/icons/creditInvoice.png')} 
          topText="Credit"
          bottomText="Invoices"
          onPress={() => handleNavigation('/(screens)/invoice/credit')}
        />
        <MenuItem 
          iconImage={require('../../assets/icons/discountAdjustment.png')} 
          topText="Discount"
          bottomText="Adjustments"
          onPress={() => handleNavigation('/(screens)/adjustments/discount')}
        />
        <MenuItem 
          iconImage={require('../../assets/icons/returnCheq.png')} 
          topText="Returned"
          bottomText="Cheques"
          onPress={() => handleNavigation('/(screens)/cheques/returned')}
        />
        <MenuItem 
          iconImage={require('../../assets/icons/sendCheqBack.png')} 
          topText="Sent Back"
          bottomText="Cheques"
          onPress={() => handleNavigation('/(screens)/cheques/sent-back')}
        />
        <MenuItem 
          iconImage={require('../../assets/icons/collectionSummary.png')} 
          topText="Collection"
          bottomText="Summary"
          onPress={() => handleNavigation('/(screens)/collection/summary')}
        />
        <MenuItem 
          iconImage={require('../../assets/icons/imageUpload.png')} 
          topText="Image"
          bottomText="Upload"
          onPress={handleImageUploadPress}
        />
      </View>

      <ImageUploadModal
        visible={isImageUploadModalVisible}
        onClose={() => setImageUploadModalVisible(false)}
        onSelectGallery={handleGallerySelect}
        onSelectBankSlip={handleBankSlipSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFFFF',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-between',
  },
});
