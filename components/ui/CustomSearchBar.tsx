import React from 'react';
import { View, TextInput, StyleSheet, Image } from 'react-native';

interface CustomSearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}

export default function CustomSearchBar({ 
  placeholder = "Search by Name / Invoice #",
  value,
  onChangeText
}: CustomSearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Image
          source={require('../../assets/icons/search.png')}
          style={styles.searchIcon}
          resizeMode="contain"
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#000000"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#324F5D',
    color: '#000000',
  },
  searchIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 8,
    fontFamily: 'Assistant',
    fontWeight: '900',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'left',
    textTransform: 'none',
    borderWidth: 0,
    borderColor: 'transparent',
    outlineColor: 'transparent',
  },
}); 