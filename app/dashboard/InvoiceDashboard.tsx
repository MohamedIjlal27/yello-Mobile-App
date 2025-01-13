import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface PaymentColumnProps {
  amount: string;
  showDivider?: boolean;
}

export default function InvoiceDashboard() {
  const PaymentColumn = ({ amount, showDivider = true }: PaymentColumnProps) => (
    <>
      <View style={styles.paymentColumn}>
        <View style={styles.paymentNumberContainer}>
          <Text style={styles.paymentNumber}>25</Text>
          <Text style={styles.paymentSlash}>/</Text>
          <Text style={styles.paymentPercentage}>25%</Text>
        </View>
        <Text style={styles.paymentAmount}>{amount}</Text>
      </View>
      {showDivider && <View style={styles.paymentDivider} />}
    </>
  )

  const PaymentSection = () => (
    <View style={styles.paymentValues}>
      <PaymentColumn amount="212,500.00" />
      <PaymentColumn amount="297,500.00" />
      <PaymentColumn amount="127,500.00" />
      <PaymentColumn amount="212,500.00" showDivider={false} />
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Invoices Section */}
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.headerText}>INVOICES</Text>
        </View>
        
        <View style={styles.contentWrapper}>
          <View style={styles.content}>
            <View style={styles.topStats}>
              <View style={styles.statColumn}>
                <Text style={styles.label}>NO. OF INVOICES</Text>
                <View style={styles.numberContainer}>
                  <Text style={styles.number}>160</Text>
                  <Text style={styles.slash}>/</Text>
                  <Text style={styles.percentage}>25%</Text>
                </View>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.statColumn}>
                <Text style={styles.label}>AMOUNT</Text>
                <View style={styles.amountContainer}>
                  <View style={styles.numberContainer}>
                    <Text style={styles.number}>75</Text>
                    <Text style={styles.percentage}>%</Text>
                  </View>
                  <Text style={styles.amount}>850,000.00</Text>
                </View>
              </View>
            </View>

            <View style={styles.horizontalDivider} />

            <View style={styles.paymentSection}>
              <View style={styles.paymentTypes}>
                <Text style={styles.paymentLabel}>CASH</Text>
                <Text style={styles.paymentLabel}>CHEQUE</Text>
                <Text style={styles.paymentLabel}>ONLINE</Text>
                <Text style={styles.paymentLabel}>CREDIT</Text>
              </View>

              <PaymentSection />
            </View>
          </View>
        </View>
      </View>

      {/* Credit Invoices Section */}
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.headerText}>CREDIT INVOICES</Text>
        </View>
        
        <View style={styles.contentWrapper}>
          <View style={styles.content}>
            <View style={styles.topStats}>
              <View style={styles.statColumn}>
                <Text style={styles.label}>NO. OF CREDIT BILLS</Text>
                <View style={styles.numberContainer}>
                  <Text style={styles.number}>160</Text>
                  <Text style={styles.slash}>/</Text>
                  <Text style={styles.percentage}>25%</Text>
                </View>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.statColumn}>
                <Text style={styles.label}>AMOUNT</Text>
                <View style={styles.amountContainer}>
                  <View style={styles.numberContainer}>
                    <Text style={styles.number}>75</Text>
                    <Text style={styles.percentage}>%</Text>
                  </View>
                  <Text style={styles.amount}>850,000.00</Text>
                </View>
              </View>
            </View>

            <View style={styles.horizontalDivider} />

            <View style={styles.paymentSection}>
              <View style={styles.paymentTypes}>
                <Text style={styles.paymentLabel}>CASH</Text>
                <Text style={styles.paymentLabel}>CHEQUE</Text>
                <Text style={styles.paymentLabel}>ONLINE</Text>
                <Text style={styles.paymentLabel}>CREDIT</Text>
              </View>

              <PaymentSection />
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 12,
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentWrapper: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  content: {
    padding: 16,
  },
  topStats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    color: '#2196F3',
    fontSize: 14,
    marginBottom: 8,
  },
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  number: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
  },
  slash: {
    fontSize: 32,
    color: '#757575',
    marginHorizontal: 4,
  },
  percentage: {
    fontSize: 20,
    color: '#757575',
  },
  amountContainer: {
    alignItems: 'center',
  },
  amount: {
    fontSize: 16,
    color: '#000',
    marginTop: 4,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
  },
  paymentSection: {
    paddingHorizontal: 8,
  },
  paymentTypes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  paymentLabel: {
    color: '#2196F3',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  paymentValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentColumn: {
    flex: 1,
    alignItems: 'center',
  },
  paymentDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  paymentNumberContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  paymentNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  paymentSlash: {
    fontSize: 20,
    color: '#757575',
    marginHorizontal: 2,
  },
  paymentPercentage: {
    fontSize: 14,
    color: '#757575',
  },
  paymentAmount: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
})