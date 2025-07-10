import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
// 1. Importa el proveedor
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

// Mantenemos el splash screen nativo visible mientras la app se carga.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Por ahora, asumimos que los assets se cargan rápido.
  // En una app más compleja, aquí se usaría `useFonts` y se esperaría a que las fuentes carguen.
  useEffect(() => {
    // Ocultamos el splash screen nativo una vez que el layout de la app se ha renderizado.
    SplashScreen.hideAsync();
  }, []);

  return (
    // 2. Envuelve tu navegador con el proveedor
    <SafeAreaProvider>
      <Stack>
        {/*
          Nuestra nueva pantalla de inicio (Splash Screen).
          Se le quita el encabezado para que ocupe toda la pantalla.
        */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        
        {/*
          La pantalla de Login, también sin encabezado.
        */}
        <Stack.Screen name="login" options={{ headerShown: false }} />

        {/* Nuevas pantallas de registro y recuperación */}
        <Stack.Screen name="register" options={{ title: 'Registro - Paso 1' }} />
        <Stack.Screen name="register-profile" options={{ title: 'Registro - Paso 2' }} />
        <Stack.Screen name="forgot-password" options={{ title: 'Recuperar Contraseña' }} />
        <Stack.Screen name="verify-otp" options={{ title: 'Verificar Código' }} />
        <Stack.Screen name="reset-password" options={{ title: 'Restablecer Contraseña' }} />

        {/* Las pantallas que ya existían */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="manual" options={{ title: 'Manual Escala' }} />
        <Stack.Screen name="adquirir-pro" options={{ title: 'Manual Sheet' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
