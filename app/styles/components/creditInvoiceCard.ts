import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    card: {
      backgroundColor: '#E9E6E6FF',
      borderRadius: 10,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: '#E5E5E5',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    shopSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    shopInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    shopIcon: {
      width: 24,
      height: 24,
      marginRight: 8,
    },
    shopName: {
      fontSize: 16,
      fontWeight: '900',
      color: '#324F5D',
      fontFamily: 'Assistant',
    },
    address: {
      fontSize: 14,
      color: '#000000',
      fontFamily: 'Assistant',
      fontWeight: '500',
    },
    locateButton: {
      backgroundColor: '#F5F5F5',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    locateIcon: {
      width: 14,
      height: 18,
      marginRight: 2,
    },
    locateText: {
      color: '#324F5D',
      fontWeight: '500',
      fontSize: 14,
    },
    invoiceSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    invoiceInfo: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginRight: 16,
      height: 50,
    },
    invoiceLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    CashIcon: {
      width: 30,
      height: 30,
      marginRight: 6,
      left: 0,
    },
    invoiceNumber: {
      fontSize: 18,
      fontWeight: '900',
      color: '#000000',
      fontFamily: 'Assistant',
      marginTop: 17
    },
    date: {
      fontSize: 14,
      color: '#000000',
      fontFamily: 'Assistant',
      fontWeight: '500',
    },
    amountSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 4,
    },
    currency: {
      fontSize: 14,
      color: '#6B7280',
      fontFamily: 'Assistant',
    },
    amount: {
      fontSize: 20,
      fontWeight: '900',
      color: '#000000',
      fontFamily: 'Assistant',
    },
    payButton: {
      backgroundColor: '#FF0000',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    payIcon: {
      width: 20,
      height: 20,
      marginRight: 8,
      tintColor: '#FFFFFF',
    },
    payText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 16,
    },
    separator: {
      height: 1,
      backgroundColor: '#BDBCBCFF',
      marginVertical: 1,
      width: '72%',
    },
    verticalSeparator: {
      width: 1,
      height: '100%',
      backgroundColor: '#BDBCBCFF',
      marginHorizontal: 16,
    },
  }); 

  export default styles; 