import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { AuthService } from '../src/services/auth.service';
import Stepper from '../components/Stepper';
import * as SecureStore from 'expo-secure-store';

const ResetPasswordScreen = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    { title: 'Enviar correo' },
    { title: 'Código' },
    { title: 'Recuperar Contraseña' },
  ];

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setError('Todos los campos son requeridos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setError('');
    setLoading(true);

    const resetToken = await SecureStore.getItemAsync('resetToken');
    if (!resetToken) {
      setError('Sesión inválida. Por favor, inicia el proceso de nuevo.');
      setLoading(false);
      return;
    }

    const result = await AuthService.resetPassword(password, resetToken);

    if (result.success) {
      await SecureStore.deleteItemAsync('resetToken');
      Alert.alert('Éxito', 'Tu contraseña ha sido actualizada. Por favor, inicia sesión.');
      router.replace('/login');
    } else {
      setError(result.error || 'Ocurrió un error al restablecer la contraseña.');
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingContainer}
    >
      <View style={styles.stepperContainer}>
        <Stepper steps={steps} currentStep={3} />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Establecer Nueva Contraseña</Text>
        <Text style={styles.label}>Nueva Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu nueva contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          cursorColor="#3B82F6"
        />
        <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirma tu nueva contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          cursorColor="#3B82F6"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Actualizar Contraseña</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  stepperContainer: {},
  formContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1F2937',
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '500',
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
    marginBottom: 20,
    color: '#1F2937',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default ResetPasswordScreen;
