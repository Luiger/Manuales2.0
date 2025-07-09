import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter, Href } from 'expo-router';
import { AuthService } from '../src/services/auth.service';
import Stepper from '../components/Stepper';

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    { title: 'Enviar correo' },
    { title: 'Código' },
    { title: 'Recuperar Contraseña' },
  ];

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Por favor, introduce tu correo electrónico.');
      return;
    }
    setLoading(true);
    setError('');

    await AuthService.forgotPassword(email);
    setLoading(false);
    
    // Navegamos a la pantalla de verificación de OTP, pasando el email.
    // Usamos `as any` como último recurso para solucionar el problema de tipado persistente de Expo Router.
    router.push({ pathname: '/verify-otp' as any, params: { email } });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingContainer}
    >
      <View style={styles.stepperContainer}>
        <Stepper steps={steps} currentStep={1} />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Recuperar contraseña</Text>
        <Text style={styles.subtitle}>
          Ingresa el correo electrónico asociado a tu cuenta para recuperar tu contraseña.
        </Text>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu correo"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          cursorColor="#3B82F6"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleForgotPassword} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Enviar</Text>}
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
  stepperContainer: {
    // Contenedor para el stepper, no se mueve
  },
  formContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#6B7280',
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
    marginBottom: 15,
    color: '#1F2937',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#1E3A8A', // Azul más oscuro
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

export default ForgotPasswordScreen;
