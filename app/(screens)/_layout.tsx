import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#FFFFFFFF',
        },
        headerTintColor: Platform.OS === 'ios' ? '#007AFF' : '#000000',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
          color: '#324F5E',
        },
        headerTitleAlign: 'center',
        headerLeft: () => 
          navigation.canGoBack() ? (
            <Ionicons 
              name="chevron-back-outline" 
              size={24} 
              color={Platform.OS === 'ios' ? '#007AFF' : '#000000'}
              onPress={() => navigation.goBack()}
              style={{ marginLeft: Platform.OS === 'ios' ? 8 : 0 }}
            />
          ) : null,
        headerBackVisible: false,
        headerTransparent: false,
        headerShadowVisible: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animation: 'slide_from_right',
        presentation: 'card'
      })}
    >
      <Stack.Screen 
        name="invoice/receipts" 
        options={{ title: "Invoice Receipts" }}       />
      <Stack.Screen 
        name="invoice/cancelled" 
        options={{ title: "Cancelled Invoices" }} 
      />
      <Stack.Screen 
        name="invoice/credit" 
        options={{ title: "Credit Invoices" }} 
      />
      <Stack.Screen 
        name="adjustments/discount" 
        options={{ title: "Discount Adjustments" }} 
      />
      <Stack.Screen 
        name="cheques/returned" 
        options={{ title: "Returned Cheques" }} 
      />
      <Stack.Screen 
        name="cheques/sent-back" 
        options={{ title: "Sent Back Cheques" }} 
      />
      <Stack.Screen 
        name="collection/summary" 
        options={{ title: "Collection Summary" }} 
      />
      <Stack.Screen 
        name="upload/image" 
        options={{ title: "Image Upload" }} 
      />
    </Stack>
  );
} 