import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="invoice/[id]"
          options={{ headerShown: true, title: '發票明細', headerTintColor: '#3366FF' }}
        />
        <Stack.Screen
          name="report/[id]"
          options={{ headerShown: true, title: '省錢報告', headerTintColor: '#3366FF' }}
        />
        <Stack.Screen
          name="product/[id]"
          options={{ headerShown: true, title: '商品詳情', headerTintColor: '#3366FF' }}
        />
      </Stack>
    </>
  );
}
