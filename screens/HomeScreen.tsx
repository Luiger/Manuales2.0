import { SafeAreaView } from 'react-native-safe-area-context';

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Card from '../components/Card';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const router = useRouter();

  return (    
    <View style={styles.container}>
      <View style={styles.row}>
        <Card
          title="Elaboración de Manual Escala"
          subtitle="Manual de Contrataciones Públicas"
          tag="#UniversitasLegal"
          footerText="Manual"
          onPress={() => router.push('/manual')}
        />
        <Card
          title="Manual Sheet"
          subtitle="Manual de Contrataciones Públicas"
          tag="#UniversitasLegal"
          footerText="Manual Sheet"
          onPress={() => router.push('/adquirir-pro' as any)}
        />
        <Card
          title="Repositorio Universitas Legal"
          subtitle="Conoce más de Universitas"
          tag="#UniversitasLegal"
          footerText="Repositorio Legal"
          //onPress={() => router.push('/home')}
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
