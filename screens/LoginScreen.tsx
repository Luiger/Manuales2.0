import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { useRouter, Link, Href } from 'expo-router';
import { AuthService } from '../src/services/auth.service'; // Importamos nuestro servicio

// --- Explicación de las importaciones ---
// Componentes de React Native:
// - View, Text, Image, TextInput, TouchableOpacity: Elementos básicos para la UI.
// - KeyboardAvoidingView, ScrollView, etc.: Para un manejo robusto del teclado.
// - ActivityIndicator: Para mostrar un spinner de carga.
// - StyleSheet: Para definir estilos.
// useRouter: Hook de expo-router para la navegación.

const LoginScreen = () => {
  // --- Hooks y Estado ---
  // router: Para navegar a otras pantallas.
  const router = useRouter();
  // email, setEmail: Estado para guardar el correo electrónico introducido por el usuario.
  const [email, setEmail] = useState('');
  // password, setPassword: Estado para guardar la contraseña.
  const [password, setPassword] = useState('');
  // loading, setLoading: Estado para saber si se está procesando una petición (ej. mostrar spinner).
  const [loading, setLoading] = useState(false);
  // error, setError: Estado para guardar cualquier mensaje de error que se deba mostrar al usuario.
  const [error, setError] = useState('');

  // --- Función de Inicio de Sesión ---
  // handleLogin: Ahora se conecta con nuestro backend a través del AuthService.
  const handleLogin = async () => {
    // Validación simple en el frontend.
    if (!email || !password) {
      setError('Por favor, introduce tu correo y contraseña.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Llamamos a la función `login` de nuestro servicio.
      const result = await AuthService.login(email, password);

      if (result.success) {
        // Si el login es exitoso, redirigimos al usuario.
        // Asumimos que la ruta principal es '/(tabs)/home'.
        // Si no tienes esa ruta, deberás ajustarla.
        router.replace('/(tabs)/home');
      } else {
        // Si el servicio devuelve un error, lo mostramos en la pantalla.
        setError(result.error || 'Ocurrió un error.');
      }
    } catch (e) {
      // Captura de cualquier error inesperado no manejado por el servicio.
      setError('Ocurrió un error inesperado al intentar iniciar sesión.');
    } finally {
      // Se ejecuta siempre, al final del try/catch.
      setLoading(false); // Detenemos el indicador de carga.
    }
  };

  // --- Renderizado de la Interfaz (UI) ---
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Logo */}
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Títulos */}
          <Text style={styles.title}>Bienvenido a Universitas</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

          {/* Inputs */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
              cursorColor="#3B82F6" // Añadimos un color visible para el cursor
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#9CA3AF"
              cursorColor="#3B82F6" // Añadimos cursorColor para consistencia
            />
          </View>

          {/* Mensaje de Error */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Botón de Login */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          {/* Enlaces de Registro y Recuperación */}
          <View style={styles.linksContainer}>
            <Link href={'/forgot-password' as Href} style={styles.link}>
              ¿Olvidaste tu contraseña?
            </Link>
            <Link href={'/register' as Href} style={styles.link}>
              ¿No tienes cuenta? Regístrate
            </Link>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

// --- Estilos ---
// Se utiliza StyleSheet para un mejor rendimiento y organización.
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB', // Un gris muy claro
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937', // Gris oscuro
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280', // Gris medio
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    gap: 15,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB', // Gris claro
    color: '#1F2937', // Añadimos un color de texto explícito (gris oscuro)
  },
  errorText: {
    color: '#EF4444', // Rojo
    marginTop: 15,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#3B82F6', // Azul
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linksContainer: {
    marginTop: 25,
    width: '100%',
    alignItems: 'center',
    gap: 15,
  },
  link: {
    color: '#3B82F6', // Azul
    fontSize: 16,
  },
});

export default LoginScreen;
