import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
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

      {/* Las pantallas que ya existían */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="manual" options={{ title: 'Manual Escala' }} />
      <Stack.Screen name="adquirir-pro" options={{ title: 'Manual Sheet' }} />
    </Stack>
  );
}
