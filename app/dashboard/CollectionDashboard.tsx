import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'

export default function CollectionDashboard() {
  return (
    <ScrollView style={styles.container}>
      {/* Collection Summary Table */}
      <View style={styles.summaryContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>COLLECTION SUMMARY</Text>
        </View>

        <View style={styles.tableContainer}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={[styles.headerCell, styles.firstColumn]} />
            <View style={styles.headerCell}>
              <View style={styles.verticalTextContainer}>
                <Text style={[styles.columnHeader, styles.verticalText]}>
                  DAILY{'\n'}INVOICE
                </Text>
              </View>
            </View>
            <View style={styles.headerCell}>
              <View style={styles.verticalTextContainer}>
                <Text style={[styles.columnHeader, styles.verticalText]}>CREDIT</Text>
              </View>
            </View>
            <View style={styles.headerCell}>
              <View style={styles.verticalTextContainer}>
                <Text style={[styles.columnHeader, styles.verticalText]}>CRN</Text>
              </View>
            </View>
            <View style={styles.headerCell}>
              <View style={styles.verticalTextContainer}>
                <Text style={[styles.columnHeader, styles.verticalText]}>
                  SENT{'\n'}BACK
                </Text>
              </View>
            </View>
          </View>

          {/* Cash Collection */}
          <View style={styles.collectionSection}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>CASH COLLECTION</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>• Quantity</Text>
              <View style={styles.cellsRow}>
                <View style={styles.cell} />
                <View style={styles.cell} />
                <View style={styles.cell} />
                <View style={styles.cell} />
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>• Amount</Text>
              <View style={styles.cellsRow}>
                <View style={styles.cell} />
                <View style={styles.cell} />
                <View style={styles.cell} />
                <View style={styles.cell} />
              </View>
            </View>
          </View>

          {/* Cheque Collection */}
          <View style={styles.collectionSection}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>CHEQUE COLLECTION</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>• Quantity</Text>
              <View style={styles.cellsRow}>
                <View style={styles.cell} />
                <View style={styles.cell} />
                <View style={styles.cell} />
                <View style={styles.cell} />
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>• Amount</Text>
              <View style={styles.cellsRow}>
                <View style={styles.cell} />
                <View style={styles.cell} />
                <View style={styles.cell} />
                <View style={styles.cell} />
              </View>
            </View>
          </View>

          {/* Online Collection */}
          <View style={styles.collectionSection}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>ONLINE COLLECTION</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>• Quantity</Text>
              <View style={styles.cellsRow}>
                <View style={styles.cell} />
                <View style={styles.cell} />
                <View style={styles.cell} />
                <View style={styles.cell} />
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>• Amount</Text>
              <View style={styles.cellsRow}>
                <View style={styles.cell} />
                <View style={styles.cell} />
                <View style={styles.cell} />
                <View style={styles.cell} />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Expenses and Deposits Container */}
      <View style={styles.summaryContainer}>
        <View style={styles.expenseDepositSection}>
          {/* Headers */}
          <View style={styles.expenseHeader}>
            <View style={styles.expenseLabelCell} />
            <View style={styles.expenseHeaderCells}>
              <Text style={styles.expenseHeaderText}>QUANTITY</Text>
              <Text style={styles.expenseHeaderText}>AMOUNT</Text>
            </View>
          </View>
          <View style={styles.expenseRow}>
            <Text style={styles.expenseLabel}>EXPENSES</Text>
            <View style={styles.expenseValueContainer}>
              <View style={styles.expenseValue} />
              <View style={styles.columnSeparator} />
              <View style={styles.expenseValue} />
            </View>
          </View>
          <View style={styles.expenseRow}>
            <Text style={styles.expenseLabel}>DEPOSITS</Text>
            <View style={styles.expenseValueContainer}>
              <View style={styles.expenseValue} />
              <View style={styles.columnSeparator} />
              <View style={styles.expenseValue} />
            </View>
          </View>
        </View>
      </View>

      {/* Balance Container */}
      <View style={styles.summaryContainer}>
        <View style={styles.balanceSection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>CASH IN HAND</Text>
            <View style={styles.summaryValue} />
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>CASH SUBMITTED</Text>
            <View style={styles.summaryValue} />
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>CASH SHORTAGE/EXCESS</Text>
            <View style={styles.summaryValue} />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 6,
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    height: 50,
    backgroundColor: '#fff',
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
  },
  firstColumn: {
    width: '30%',
    flex: 0,
    borderLeftWidth: 0,
  },
  verticalTextContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalText: {
    transform: [{ rotate: '-90deg' }],
    width: 80,
    textAlign: 'center',
    fontSize: 12,
    color: '000000',
    fontWeight: 'bold',
    lineHeight: 20,
    fontFamily: 'Inter',
  },
  columnHeader: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
  collectionSection: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  sectionTitleContainer: {
    backgroundColor: '#E6E8EB',
    padding: 6,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    height: 32,
  },
  label: {
    width: '30%',
    fontSize: 12,
    color: '#333',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    paddingLeft: 12,
    paddingRight: 6,
    textAlignVertical: 'center',
    height: '100%',
    paddingTop: 8,
    fontFamily: 'Inter',
  },
  cellsRow: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
  },
  cell: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
  },
  expenseDepositSection: {
    padding: 8,
  },
  balanceSection: {
    padding: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    height: 32,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#2196F3',
    flex: 1,
    fontFamily: 'Inter',
  },
  summaryColumns: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    
  },
  summaryValue: {
    width: '59%',
    height: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  noBorderLeft: {
    borderLeftWidth: 0,
  },
  expenseHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    height: 32,
  },
  expenseLabelCell: {
    width: '30%',
  },
  expenseHeaderCells: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  expenseRow: {
    flexDirection: 'row',
    height: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  expenseLabel: {
    width: '30%',
    fontSize: 12,
    color: '#2196F3',
    paddingLeft: 12,
    textAlignVertical: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    paddingTop: 8,
    fontFamily: 'Inter',
  },
  expenseValueContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  expenseValue: {
    flex: 1,
    height: 20,
    marginHorizontal: 4,
  },
  lastValue: {
    borderRightWidth: 0,
  },
  expenseHeaderText: {
    fontSize: 12,
    color: '000000',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '35%',
    fontFamily: 'Inter',
  },
  columnSeparator: {
    width: 1,
    backgroundColor: '#E0E0E0',
    height: 32,
  },
})