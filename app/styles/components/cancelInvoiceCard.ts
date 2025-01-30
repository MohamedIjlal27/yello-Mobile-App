import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  shopInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 8,
  },
  shopIcon: {
    marginRight: 8,
    marginTop: 4,
  },
  shopDetails: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  locateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  locateIcon: {
    marginRight: 4,
  },
  locateText: {
    fontSize: 12,
    color: '#0066CC',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  invoiceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  invoiceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  CashIcon: {
    marginRight: 8,
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  date: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  verticalSeparator: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 1,
    alignSelf: 'center',
  },
  amountSection: {
    alignItems: 'flex-end',
    flex: 1,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  currency: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  discountCurrency: {
    fontSize: 12,
    color: '#A01515',
    fontWeight: '500',
  },
  discountAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A01515',
  },
  payButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 12,
  },
  payText: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 