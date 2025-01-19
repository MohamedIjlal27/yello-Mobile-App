import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFFFF',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
          color: '#324F5E',
        },
        headerTitleAlign: 'left',
      }}
    >
      <Stack.Screen 
        name="invoice/receipts" 
        options={{ title: "Invoice Receipts" }} 
      />
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