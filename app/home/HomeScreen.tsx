import { StyleSheet, View, ScrollView, Dimensions, NativeScrollEvent, NativeSyntheticEvent, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import MenuScreen from '../menu/MenuScreen'
import CollectionDashboard from '../dashboard/CollectionDashboard'
import InvoiceDashboard from '../dashboard/InvoiceDashboard'
import ProfileSection from '../../components/ui/ProfileSection'
import ProfileModal from '../../components/modals/ProfileModal'
import { getUserData } from '../../store/database'

const { width } = Dimensions.get('window')

export default function HomeScreen() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false)
  const [localUserData, setLocalUserData] = useState<any>(null)
  const { empName, jobTitle, profilePic } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    const loadLocalData = async () => {
      try {
        const dbUserData = await getUserData();
        if (dbUserData) {
          setLocalUserData(dbUserData);
        }
      } catch (error) {
        console.error('Error loading user data from database:', error);
      }
    };

    loadLocalData();
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x
    const page = Math.round(offsetX / width)
    setCurrentPage(page)
  }

  // Use database data if available, fallback to Redux state
  const displayName = localUserData?.emp_name || empName;
  const displayRole = localUserData?.job_title || jobTitle?.en_US || 'Cash Collector';
  const displayPic = localUserData?.profile_pic || profilePic;

  return (
    <View style={styles.container}>
      <ProfileSection
        name={displayName}
        role={displayRole}
        lastUpdated="Last updated at 09-Jan-25 09:46 AM"
        onAvatarPress={() => setIsProfileModalVisible(true)}
        profilePic={displayPic}
      />

      {/* Profile Modal */}
      <ProfileModal
        visible={isProfileModalVisible}
        onClose={() => setIsProfileModalVisible(false)}
        name={displayName}
        role={displayRole}
        profilePic={displayPic}
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