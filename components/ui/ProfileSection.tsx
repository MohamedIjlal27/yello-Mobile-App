import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserData } from '../../store/database';

interface ProfileSectionProps {
  name: string;
  role: string;
  lastUpdated: string;
  onAvatarPress?: () => void;
  profilePic: string | null;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ 
  name, 
  role, 
  lastUpdated, 
  onAvatarPress,
  profilePic 
}) => {
  const [localUserData, setLocalUserData] = useState<any>(null);

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

  // Use database data if available, fallback to props
  const displayName = localUserData?.emp_name || name;
  const displayRole = localUserData?.job_title || role;
  const displayPic = localUserData?.profile_pic || profilePic;

  return (
    <View style={styles.profileContainer}>
      <View style={styles.notificationContainer}>
        <TouchableOpacity style={styles.notificationIcon}>
          <Image
            source={require('../../assets/icons/pushNotificationIcon.png')}
            style={styles.notificationIcon}
          />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>1</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.profileInfo}>
        <TouchableOpacity onPress={onAvatarPress}>
          <Image
            source={displayPic ? { uri: displayPic } : require('../../assets/images/default-avatar.png')}
            style={styles.avatar}
          />
          <View style={styles.onlineIndicator} />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userRole}>{displayRole}</Text>
          <View style={styles.lastUpdated}>
            <Ionicons name="sync-outline" size={14} color="#666" />
            <Text style={styles.lastUpdatedText}>{lastUpdated}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: '#F4F4F4',
    padding: 30,
    marginBottom: 20,
    borderBottomEndRadius: 16,
    borderBottomStartRadius: 16,
    height: 165,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileInfo: {
    top: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    position: 'absolute',
    left: 45,
    top: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  userRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  lastUpdated: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  notificationContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  notificationIcon: {
    padding: 5,
  },
  notificationBadge: {
    position: 'absolute',
    right: -2,
    top: 0,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ProfileSection; 