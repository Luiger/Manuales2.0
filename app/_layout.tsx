import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// 1. Importa el GestureHandlerRootView
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    // 2. Envuelve TODO con GestureHandlerRootView. El estilo flex: 1 es crucial.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          
          {/* Carpeta Tabs */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Carpeta Profile */}
          <Stack.Screen name="(profile)" options={{ headerShown: false }} />
          {/* Carpeta Auth */}
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          {/* Interfaz de Manual de Contrataciones */}
          <Stack.Screen name="manuales2" options={{ title: 'Manual de Contrataciones' }} />

        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
