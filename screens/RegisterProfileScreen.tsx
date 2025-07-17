import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href, Link } from 'expo-router';
import { AuthService } from '../src/services/auth.service';
import Stepper from '../components/Stepper';
import CustomInput from '../components/CustomInput';
import * as SecureStore from 'expo-secure-store';

const RegisterProfileScreen = () => {
  const router = useRouter();
  const [profile, setProfile] = useState({
    Nombre: '',
    Apellido: '',
    Telefono: '',
    Institucion: '',
    Cargo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    { title: 'Credenciales' },
    { title: 'Datos personales' },
  ];
  const isFormValid =
    profile.Nombre.trim() !== '' &&
    profile.Apellido.trim() !== '' &&
    profile.Telefono.trim() !== '' &&
    profile.Institucion.trim() !== '' &&
    profile.Cargo.trim() !== '';

  const handleInputChange = (name: keyof typeof profile, value: string) => {
    setProfile(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCompleteProfile = async () => {
    if (!isFormValid) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    setError('');
    setLoading(true);
    const tempToken = await SecureStore.getItemAsync('tempRegToken');
    if (!tempToken) {
      setError('Sesión inválida. Por favor, inicia el registro de nuevo.');
      setLoading(false);
      return;
    }
    try {
      const result = await AuthService.registerProfile(profile, tempToken);
      if (result.success) {
        await SecureStore.deleteItemAsync('tempRegToken');
        Alert.alert('¡Registro completado!', 'Ahora puedes iniciar sesión.');
        router.replace('/login' as Href);
      } else {
        setError(result.error || 'Ocurrió un error al completar el perfil.');
      }
    } catch (e) {
      setError('Ocurrió un error inesperado al completar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.mainContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Completa tus datos</Text>
              <Text style={styles.subtitle}>Por favor, introduce tus datos personales</Text>
              <Stepper steps={steps} currentStep={2} />
            </View>
            <View style={styles.formContainer}>
              <CustomInput
                label="Nombre"
                placeholder="Ingresa tu nombre"
                value={profile.Nombre}
                onChangeText={(val) => handleInputChange('Nombre', val)}
                containerStyle={styles.inputContainer}
              />
              <CustomInput
                label="Apellido"
                placeholder="Ingresa tu apellido"
                value={profile.Apellido}
                onChangeText={(val) => handleInputChange('Apellido', val)}
                containerStyle={styles.inputContainer}
              />
              <CustomInput
                label="Teléfono"
                placeholder="Ingresa tu número"
                value={profile.Telefono}
                onChangeText={(val) => handleInputChange('Telefono', val)}
                keyboardType="phone-pad"
                containerStyle={styles.inputContainer}
              />
              <CustomInput
                label="Institución"
                placeholder="Ingresa tu institución"
                value={profile.Institucion}
                onChangeText={(val) => handleInputChange('Institucion', val)}
                containerStyle={styles.inputContainer}
              />
              <CustomInput
                label="Cargo"
                placeholder="Ingresa tu cargo"
                value={profile.Cargo}
                onChangeText={(val) => handleInputChange('Cargo', val)}
                containerStyle={styles.inputContainer}
              />
            </View>
          </View>

          <View style={styles.footer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity
              style={[styles.button, !isFormValid && styles.buttonDisabled]}
              onPress={handleCompleteProfile}
              disabled={!isFormValid || loading}
            >
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Crear cuenta</Text>}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  mainContent: {},
  footer: {
    paddingTop: 10,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
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
  formContainer: {},
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
  inputContainer: {
    marginBottom: 15,
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

export default RegisterProfileScreen;
