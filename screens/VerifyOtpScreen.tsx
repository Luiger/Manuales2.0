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
import { useRouter, useLocalSearchParams, Href } from 'expo-router';
import { AuthService } from '../src/services/auth.service';
import Stepper from '../components/Stepper';
import * as SecureStore from 'expo-secure-store';

const VerifyOtpScreen = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams(); // Recibimos el email de la pantalla anterior
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    { title: 'Enviar correo' },
    { title: 'Código' },
    { title: 'Recuperar Contraseña' },
  ];

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Por favor, introduce un código de 6 dígitos.');
      return;
    }
    setLoading(true);
    setError('');

    const result = await AuthService.verifyOtp(email as string, otp);

    if (result.success && result.resetToken) {
      // Guardamos el token de reseteo para el siguiente paso
      await SecureStore.setItemAsync('resetToken', result.resetToken);
      router.push('/reset-password' as Href);
    } else {
      setError(result.error || 'Ocurrió un error al verificar el código.');
    }
    
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingContainer}
    >
      <View style={styles.stepperContainer}>
        <Stepper steps={steps} currentStep={2} />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Verificar Código</Text>
        <Text style={styles.subtitle}>
          Hemos enviado un código a <Text style={{fontWeight: 'bold'}}>{email}</Text>. Por favor, ingrésalo a continuación.
        </Text>
        <Text style={styles.label}>Código de Verificación</Text>
        <TextInput
          style={styles.input}
          placeholder="123456"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          cursorColor="#3B82F6"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Verificar</Text>}
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
        textAlign: 'center',
        letterSpacing: 5,
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

export default VerifyOtpScreen;
