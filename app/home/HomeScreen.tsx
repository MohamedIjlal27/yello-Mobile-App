import { StyleSheet, View, ScrollView, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import React, { useState } from 'react'
import MenuScreen from '../menu/MenuScreen'
import CollectionDashboard from '../dashboard/CollectionDashboard'
import InvoiceDashboard from '../dashboard/InvoiceDashboard'
import ProfileSection from '../../components/ui/ProfileSection'

const { width } = Dimensions.get('window')

export default function HomeScreen() {
  const [currentPage, setCurrentPage] = useState(1)

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x
    const page = Math.round(offsetX / width)
    setCurrentPage(page)
  }

  return (
    <View style={styles.container}>
      {/* Static Profile Section */}
      <ProfileSection
        name="Charith Madhuranga"
        role="Cash Collector"
        lastUpdated="Last updated at 09-Jan-25 09:46 AM"
      />

      {/* Scrollable Content */}
      <View style={styles.scrollContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          contentOffset={{ x: width, y: 0 }}
          onScroll={handleScroll}
          style={styles.scrollView}
        >
          <View style={styles.screen}>
            <ScrollView>
              <InvoiceDashboard />
            </ScrollView>
          </View>
          <View style={styles.screen}>
            <ScrollView>
              <MenuScreen />
            </ScrollView>
          </View>
          <View style={styles.screen}>
            <ScrollView>
              <CollectionDashboard />
            </ScrollView>
          </View>
        </ScrollView>
        
        <View style={styles.paginationDots}>
          {[0, 1, 2].map((index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: currentPage === index ? '#FF0000' : '#D3D3D3' }
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    marginTop: -20,
  },
  scrollView: {
    flex: 1,
  },
  screen: {
    width: width,
    flex: 1,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  }
})