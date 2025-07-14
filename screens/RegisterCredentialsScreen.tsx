import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter, Href, Link } from 'expo-router';
import { AuthService } from '../src/services/auth.service';
import * as SecureStore from 'expo-secure-store';
import Stepper from '../components/Stepper';
import CustomInput from '../components/CustomInput';
import { validateEmail, validatePassword } from '../src/utils/validators';
// 1. Se importa KeyboardAwareScrollView y se eliminan los otros componentes de scroll
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

const RegisterCredentialsScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    { title: 'Credenciales' },
    { title: 'Datos personales' },
  ];

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Todos los campos son requeridos.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Por favor, introduce un correo electrónico válido.');
      return;
    }
    if (!validatePassword(password)) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await AuthService.registerCredentials(email, password);

      if (result.success && result.tempToken) {
        await SecureStore.setItemAsync('tempRegToken', result.tempToken);
        router.push('/register-profile' as Href);
      } else {
        setError(result.error || 'Ocurrió un error durante el registro.');
      }
    } catch (e) {
      setError('Ocurrió un error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // 2. Se reemplaza KeyboardAvoidingView por SafeAreaView
    <SafeAreaView style={styles.safeArea}>
        {/* 3. Se usa KeyboardAwareScrollView para envolver todo el contenido */}
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}
            extraScrollHeight={20}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Crea tu cuenta</Text>
                <Text style={styles.subtitle}>Por favor, introduce tus datos para iniciar sesión</Text>
                <Stepper steps={steps} currentStep={1} />
            </View>

            <View style={styles.formContainer}>
                <CustomInput
                    label="Correo electrónico"
                    placeholder="Ingresa tu correo"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    containerStyle={styles.inputContainer}
                />
                <CustomInput
                    label="Contraseña"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    containerStyle={styles.inputContainer}
                />
                <CustomInput
                    label="Confirmar Contraseña"
                    placeholder="Repite tu contraseña"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    containerStyle={styles.inputContainer}
                />
            </View>

            {/* Se agrupa el contenido inferior para un mejor manejo del layout */}
            <View style={styles.footer}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Siguiente</Text>}
                </TouchableOpacity>
                <View style={styles.loginLinkContainer}>
                    <Text>¿Ya tienes una cuenta? </Text>
                    <Link href="/login" style={styles.loginLink}>
                    Inicia sesión
                    </Link>
                </View>
            </View>
        </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flexGrow: 1,
    padding: 20,// Asegura que el footer quede abajo
  },
  header: {
    marginBottom: 20,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6B7280',
  },
  formContainer: {
    // No necesita estilos complejos
  },
  footer: {
    paddingTop: 10,
  },
  inputContainer: {
    marginBottom: 15,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 10,
  },
  loginLinkContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginLink: {
    color: '#3B82F6',
    fontWeight: 'bold',
  },
});

export default RegisterCredentialsScreen;
