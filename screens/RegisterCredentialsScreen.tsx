import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter, Href, Link } from 'expo-router';
import { AuthService } from '../src/services/auth.service';
import * as SecureStore from 'expo-secure-store';
import Stepper from '../components/Stepper';
import CustomInput from '../components/CustomInput';
import { validateEmail, validatePassword } from '../src/utils/validators';

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
    // 1. Validación de campos vacíos
    if (!email || !password || !confirmPassword) {
      setError('Todos los campos son requeridos.');
      return;
    }
    // 2. Validación de formato de correo electrónico
    if (!validateEmail(email)) {
      setError('Por favor, introduce un correo electrónico válido.');
      return;
    }
    // 3. Validación de longitud de la contraseña
    if (!validatePassword(password)) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    // 4. Validación de coincidencia de contraseñas
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // Si todas las validaciones pasan, limpiamos los errores y empezamos la carga.
    setError('');
    setLoading(true);

    try {
      // Llamamos al servicio de autenticación para registrar las credenciales.
      const result = await AuthService.registerCredentials(email, password);

      // Si el registro de credenciales es exitoso y obtenemos un token temporal...
      if (result.success && result.tempToken) {
        // Guardamos el token de forma segura para usarlo en el siguiente paso.
        await SecureStore.setItemAsync('tempRegToken', result.tempToken);
        // Navegamos a la pantalla de perfil de registro.
        router.push('/register-profile' as Href);
      } else {
        // Si el servicio devuelve un error, lo mostramos.
        setError(result.error || 'Ocurrió un error durante el registro.');
      }
    } catch (e) {
      // Capturamos cualquier error inesperado durante el proceso.
      setError('Ocurrió un error inesperado. Inténtalo de nuevo.');
    } finally {
      // Se ejecuta siempre, al final del try/catch.
      setLoading(false); // Detenemos el indicador de carga.
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingContainer}
    >
      <ScrollView contentContainerStyle={styles.container}>
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
          />
          <CustomInput
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <CustomInput
            label="Confirmar Contraseña"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
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
    // Estilos para el contenedor del formulario
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    // Los estilos del input se definen en el componente CustomInput.
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
    //textDecorationLine: 'underline',
  },
});

export default RegisterCredentialsScreen;
