import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="manual" options={{ title: 'Manual Escala' }} />
      <Stack.Screen name="adquirir-pro" options={{ title: 'Manual Sheet' }} />
    </Stack>
  );
}
