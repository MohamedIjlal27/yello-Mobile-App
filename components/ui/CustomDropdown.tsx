import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import PolygonIcon from '../../assets/icons/Polygon.svg';

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  onDropdownStateChange?: (isOpen: boolean) => void;
}

const CustomDropdown = ({
  value,
  onChange,
  options,
  placeholder = 'Select Option',
  onDropdownStateChange
}: CustomDropdownProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownToggle = (isOpen: boolean) => {
    setShowDropdown(isOpen);
    onDropdownStateChange?.(isOpen);
  };

  return (
    <>
      <Pressable 
        style={styles.pickerWrapper}
        onPress={() => handleDropdownToggle(!showDropdown)}
      >
        <Text style={[styles.pickerText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <View style={[styles.iconContainer, showDropdown && styles.iconRotated]}>
          <PolygonIcon width={16} height={13} fill="#6B7280" />
        </View>
      </Pressable>
      {showDropdown && (
        <View style={styles.dropdownList}>
          <ScrollView style={styles.dropdownScroll} bounces={false}>
            {options.map((option) => (
              <Pressable
                key={option}
                style={styles.dropdownItem}
                onPress={() => {
                  onChange(option);
                  handleDropdownToggle(false);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  option === placeholder && styles.placeholderText
                ]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  pickerWrapper: {
    flex: 1,
    height: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  iconContainer: {
    transform: [{ rotate: '0deg' }],
  },
  iconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 38,
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 4,
    maxHeight: 180,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownScroll: {
    width: '100%',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#374151',
  },
});

export default CustomDropdown;
