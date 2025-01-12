import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import MenuItem from '../components/MenuItem';
import ProfileSection from '../components/ProfileSection';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <ProfileSection
        name="Charith Madhuranga"
        role="Cash Collector"
        lastUpdated="Last updated at 09-Jan-25 09:46 AM"
      />

      {/* Menu Grid */}
      <View style={styles.menuGrid}>
        <MenuItem 
          iconImage={require('../../assets/icons/invoiceReceipt.png')} 
          topText="Invoice"
          bottomText="Receipts"
        />
        <MenuItem 
          iconImage={require('../../assets/icons/cancelledInvoice.png')} 
          topText="Cancelled"
          bottomText="Invoices"
        />
        <MenuItem 
          iconImage={require('../../assets/icons/creditInvoice.png')} 
          topText="Credit"
          bottomText="Invoices"
        />
        <MenuItem 
          iconImage={require('../../assets/icons/discountAdjustment.png')} 
          topText="Discount"
          bottomText="Adjustments"
        />
        <MenuItem 
          iconImage={require('../../assets/icons/returnCheq.png')} 
          topText="Returned"
          bottomText="Cheques"
        />
        <MenuItem 
          iconImage={require('../../assets/icons/sendCheqBack.png')} 
          topText="Sent Back"
          bottomText="Cheques"
        />
        <MenuItem 
          iconImage={require('../../assets/icons/collectionSummary.png')} 
          topText="Collection"
          bottomText="Summary"
        />
        <MenuItem 
          iconImage={require('../../assets/icons/imageUpload.png')} 
          topText="Image"
          bottomText="Upload"
        />
      </View>
    </ScrollView>
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
