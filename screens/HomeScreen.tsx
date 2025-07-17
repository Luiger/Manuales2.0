import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Card from '../components/Card';

const HomeScreen = () => {
  const router = useRouter();

  // La lógica de verificación se movió a Manuales2Screen.
  // El onPress ahora es una navegación simple y directa.
  
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Card
          title="Manual Contrataciones"
          subtitle="Manual de Contrataciones Públicas"
          tag="#UniversitasLegal"
          footerText="Manual Contrataciones"
          onPress={() => router.push('/manuales2')}
        />
        <Card
          title="Manual Sheet"
          subtitle="Manual de Contrataciones Públicas"
          tag="#UniversitasLegal"
          footerText="Manual Sheet"
          onPress={() => router.push('/manuales2')}
        />
        <Card
          title="Repositorio Universitas Legal"
          subtitle="Conoce más de Universitas"
          tag="#UniversitasLegal"
          footerText="Repositorio Legal"
        />
        <Card
          title="Repositorio Universitas Legal"
          subtitle="Conoce más de Universitas"
          tag="#UniversitasLegal"
          footerText="Repositorio Legal"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 10,
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
});

export default HomeScreen;
