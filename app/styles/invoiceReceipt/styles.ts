import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale, spacing, typography, getResponsiveWidth } from '../../utils/dimensions';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: spacing.sm,
    },
    scrollView: {
      flex: 1,
      paddingVertical: spacing.sm,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    loadingText: {
      marginTop: spacing.sm,
      fontSize: typography.body,
      color: '#666',
    },
    errorText: {
      color: 'red',
      fontSize: typography.body,
      textAlign: 'center',
    },
    noDataText: {
      fontSize: typography.body,
      color: '#666',
      textAlign: 'center',
    },

    card: {
      backgroundColor: '#F5F5F5',
      borderRadius: scale(10),
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: scale(2),
      },
      shadowOpacity: 0.1,
      shadowRadius: scale(4),
      elevation: 3,
    },
    shopSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.xs,
    },
    shopInfo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    shopIcon: {
      width: scale(24),
      height: scale(24),
      marginRight: spacing.sm,
    },
    shopDetailsContainer: {
      flex: 1,
      marginRight: spacing.sm,
      flexShrink: 1,
    },
    shopName: {
      fontSize: typography.title,
      fontWeight: '700',
      color: '#324F5D',
      marginBottom: spacing.xs,
    },
    address: {
      fontSize: typography.caption,
      color: '#666666',
      lineHeight: scale(16),
      flexWrap: 'wrap',
      maxWidth: '90%',
      flexShrink: 1,
    },
    addressText: {
      fontSize: typography.caption,
      color: '#666666',
      lineHeight: scale(16),
    },
    locateSection: {
      alignItems: 'flex-end',
      width: 'auto',
    },
    locateButton: {
      backgroundColor: '#FFFFFFFF',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: scale(8),
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-end',
      marginBottom: spacing.xs,
    },
    locateIcon: {
      width: scale(14),
      height: scale(18),
      marginRight: spacing.xs,
    },
    locateText: {
      color: '#324F5D',
      fontWeight: '500',
      fontSize: typography.body,
    },
    invoiceSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    invoiceInfo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    invoiceLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: spacing.sm,
    },
    closeIcon: {
      width: scale(24),
      height: scale(24),
      marginRight: spacing.sm,
    },
    invoiceDetails: {
      flex: 1,
      minWidth: 0, // Allow text to wrap
    },
    invoiceNumber: {
      fontSize: typography.title,
      fontWeight: '700',
      color: '#000000',
      marginBottom: spacing.xs,
      flexShrink: 1, // Allow text to shrink if needed
    },
    date: {
      fontSize: typography.caption,
      color: '#666666',
      textAlign: 'right',
      marginTop: spacing.xs,
      alignSelf: 'flex-end',
    },
    priceSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: spacing.xs,
      alignSelf: 'flex-end',
    },
    amountSection: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: spacing.md,
      paddingVertical: spacing.sm,
      borderLeftWidth: 1,
      borderLeftColor: '#E5E7EB',
      flexShrink: 0, // Prevent amount from shrinking
      minWidth: scale(120), // Ensure minimum width for amount
    },
    currency: {
      fontSize: typography.body,
      color: '#6B7280',
      marginRight: spacing.xs,
    },
    amount: {
      fontSize: typography.header,
      fontWeight: '700',
      color: '#000000',
      flexShrink: 0, // Prevent amount from shrinking
    },
    payButton: {
      backgroundColor: '#FF0000',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: scale(8),
      flexDirection: 'row',
      alignItems: 'center',
      minWidth: scale(80),
      justifyContent: 'center',
      flexShrink: 0, // Prevent button from shrinking
      marginLeft: spacing.sm,
    },
    payIcon: {
      width: scale(20),
      height: scale(20),
      marginRight: spacing.xs,
      tintColor: '#FFFFFF',
    },
    payText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: typography.body,
    },
    separator: {
      height: 1,
      backgroundColor: '#E5E7EB',
      marginVertical: spacing.xs,
    },
    verticalSeparator: {
      width: 1,
      backgroundColor: '#E5E7EB',
      marginHorizontal: spacing.sm,
      alignSelf: 'stretch',
    },
});

export default styles; 