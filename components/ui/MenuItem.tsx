import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MenuItemProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconImage?: ImageSourcePropType;
  title?: string;
  topText?: string;
  bottomText?: string;
  subtitle?: string;
  onPress?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, iconImage, title, topText, bottomText, subtitle, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    {iconImage ? (
      <Image source={iconImage} style={styles.menuIcon} />
    ) : (
      <View style={styles.iconContainer}>
        {icon && <Ionicons name={icon} size={32} color="#4B6BFB" />}
      </View>
    )}
    {title ? (
      <Text style={styles.menuTitle}>{title}</Text>
    ) : (
      <View style={styles.titleContainer}>
        <Text style={styles.menuTitleTop}>{topText}</Text>
        <Text style={styles.menuTitleBottom}>{bottomText}</Text>
      </View>
    )}
    {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  menuItem: {
    backgroundColor: '#fff',
    width: '45%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuIcon: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  titleContainer: {
    alignItems: 'center',
  },
  menuTitleTop: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  menuTitleBottom: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 2,
  },
});

export default MenuItem; 