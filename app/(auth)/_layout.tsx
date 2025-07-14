import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';

export default function AuthLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerTitle: '', 
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#F9FAFB' },
        // ✅ CORRECCIÓN: Esta línea le dice al navegador que oculte su botón nativo de "volver".
        headerBackVisible: false,        

        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: 0 }}>
            <ChevronLeftIcon size={28} color="#1F2937" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      
      <Stack.Screen name="register" />
      <Stack.Screen name="register-profile" />
      <Stack.Screen name="forgot-password" />
      {/*<Stack.Screen name="verify-otp" />
      <Stack.Screen name="reset-password" />*/}
    </Stack>
  );
}
