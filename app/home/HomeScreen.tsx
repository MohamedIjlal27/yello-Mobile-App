import { StyleSheet, View, ScrollView, Dimensions } from 'react-native'
import React, { useState } from 'react'
import MenuScreen from '../menu/MenuScreen'
import CollectionDashboard from '../dashboard/CollectionDashboard'
import InvoiceDashboard from '../dashboard/InvoiceDashboard'

const { width } = Dimensions.get('window')

export default function HomeScreen() {
  const [currentPage, setCurrentPage] = useState(1)

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x
    const page = Math.round(offsetX / width)
    setCurrentPage(page)
  }

  return (
    <View style={styles.container}>
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
          <InvoiceDashboard />
        </View>
        <View style={styles.screen}>
          <MenuScreen />
        </View>
        <View style={styles.screen}>
          <CollectionDashboard />
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    bottom: 10,
    width: '100%',
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 4,
    marginHorizontal: 4,
  }
})