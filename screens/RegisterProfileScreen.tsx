import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { AuthService } from '../src/services/auth.service';
import * as SecureStore from 'expo-secure-store';

const RegisterProfileScreen = () => {
  const router = useRouter();
  const [profile, setProfile] = useState({
    Nombre: '',
    Apellido: '',
    Telefono: '',
    Institucion: '',
    Cargo: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (name: keyof typeof profile, value: string) => {
    setProfile(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCompleteProfile = async () => {
    setError('');
    setLoading(true);

    const tempToken = await SecureStore.getItemAsync('tempRegToken');
    if (!tempToken) {
      setError('Sesión inválida. Por favor, inicia el registro de nuevo.');
      setLoading(false);
      return;
    }

    const result = await AuthService.registerProfile(profile, tempToken);

    if (result.success) {
      await SecureStore.deleteItemAsync('tempRegToken');
      alert('¡Registro completado! Ahora puedes iniciar sesión.');
      router.replace('/login');
    } else {
      setError(result.error || 'Ocurrió un error al completar el perfil.');
    }

    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Cuenta (Paso 2 de 2)</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={profile.Nombre}
        onChangeText={(val) => handleInputChange('Nombre', val)}
        cursorColor="#3B82F6"
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={profile.Apellido}
        onChangeText={(val) => handleInputChange('Apellido', val)}
        cursorColor="#3B82F6"
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={profile.Telefono}
        onChangeText={(val) => handleInputChange('Telefono', val)}
        keyboardType="phone-pad"
        cursorColor="#3B82F6"
      />
      <TextInput
        style={styles.input}
        placeholder="Institución"
        value={profile.Institucion}
        onChangeText={(val) => handleInputChange('Institucion', val)}
        cursorColor="#3B82F6"
      />
      <TextInput
        style={styles.input}
        placeholder="Cargo"
        value={profile.Cargo}
        onChangeText={(val) => handleInputChange('Cargo', val)}
        cursorColor="#3B82F6"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleCompleteProfile} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Finalizar Registro</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#F9FAFB',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 30,
      color: '#1F2937',
    },
    input: {
      width: '100%',
      height: 50,
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      paddingHorizontal: 15,
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#D1D5DB',
      marginBottom: 15,
      color: '#1F2937',
    },
    button: {
      width: '100%',
      height: 50,
      backgroundColor: '#3B82F6',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    errorText: {
      color: '#EF4444',
      textAlign: 'center',
      marginBottom: 10,
    },
  });

export default RegisterProfileScreen;
