import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function AuthLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      
      {/* Nuevas pantallas de registro y recuperación */}
          <Stack.Screen name="register" options={{ title: 'Registro - Paso 1' }} />
          <Stack.Screen name="register-profile" options={{ title: 'Registro - Paso 2' }} />
          <Stack.Screen name="forgot-password" options={{ title: 'Recuperar Contraseña' }} />
          <Stack.Screen name="verify-otp" options={{ title: 'Verificar Código' }} />
          <Stack.Screen name="reset-password" options={{ title: 'Restablecer Contraseña' }} />
    </Stack>
        </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
