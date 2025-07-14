import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
// Importamos un nuevo componente de Avatar específico para el header
import HeaderAvatar from './HeaderAvatar'; // Debemos crear este componente

const logo = require('../assets/images/logo.png');

export default function CustomHeader() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ backgroundColor: '#F3F4F6' }} edges={['top']}>
      <View style={{ flexDirection: 'row', height: 64, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 }}>
        {/* Izquierda: Avatar que abre el menú */}
        <TouchableOpacity onPress={() => router.push('/menu')}>
          <HeaderAvatar />
        </TouchableOpacity>

        {/* Centro: Logo y Título */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={logo} style={{ width: 32, height: 32, marginRight: 8 }} resizeMode="contain" />
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Manuales de Contrataciones</Text>
        </View>

        {/* Derecha: Espaciador para centrar el título */}
        <View style={{ width: 40 }} />
      </View>
    </SafeAreaView>
  );
}
