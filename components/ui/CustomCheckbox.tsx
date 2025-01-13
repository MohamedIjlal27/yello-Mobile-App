import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';

interface CustomCheckboxProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  color?: string;
}

export default function CustomCheckbox({
  label,
  value,
  onValueChange,
  color = '#FF0000'
}: CustomCheckboxProps) {
  return (
    <View style={styles.container}>
      <Checkbox
        value={value}
        onValueChange={onValueChange}
        color={value ? color : undefined}
        style={styles.checkbox}
      />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkbox: {
    marginRight: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#666',
  },
  text: {
    fontSize: 16,
    color: '#000000FF',
    fontWeight: '500',
  },
}); 