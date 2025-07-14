import { Stack } from 'expo-router';
import React from 'react';

export default function ProfileLayout() {
  return (
    <Stack>
      {/* Ocultamos el header por defecto para todas las pantallas en este grupo.
          Esto nos da control total sobre el header en cada archivo de pantalla. */}
      <Stack.Screen name="menu" options={{ headerShown: false }} />
      <Stack.Screen name="edit" options={{ headerShown: false }} />
      <Stack.Screen name="change-password" options={{ headerShown: false }} />
    </Stack>
  );
}
