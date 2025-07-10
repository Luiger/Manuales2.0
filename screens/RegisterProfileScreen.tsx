import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  Button
} from 'react-native';
import { useRouter, Href, Link } from 'expo-router';
import { AuthService } from '../src/services/auth.service';
import Stepper from '../components/Stepper';
import CustomInput from '../components/CustomInput';
import DateTimePicker from '@react-native-community/datetimepicker'; // npm install @react-native-community/datetimepicker
import * as SecureStore from 'expo-secure-store';

const RegisterProfileScreen = () => {
  const router = useRouter();
  const [profile, setProfile] = useState({
    Nombre: '',
    Apellido: '',
    Telefono: '',
    Institucion: '',
    Cargo: '',
    Genero: '',
    FechaNacimiento: new Date(), // Inicializamos con la fecha actual
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const steps = [
    { title: 'Credenciales' },
    { title: 'Datos personales' },
  ];

  const handleInputChange = (name: keyof typeof profile, value: string) => {
    setProfile(prevState => ({ ...prevState, [name]: value }));
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || profile.FechaNacimiento;
    setShowDatePicker(Platform.OS === 'ios');
    setProfile(prevState => ({ ...prevState, FechaNacimiento: currentDate }));
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingContainer}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Completa tus datos para crear tu cuenta</Text>
          <Text style={styles.subtitle}>Por favor, introduce tus datos personales</Text>
          <Stepper steps={steps} currentStep={2} />
        </View>
        <View style={styles.formContainer}>
          <CustomInput
            label="Nombre"
            placeholder="Ingresa tu nombre"
            value={profile.Nombre}
            onChangeText={(val) => handleInputChange('Nombre', val)}
          />
          <CustomInput
            label="Apellido"
            placeholder="Ingresa tu apellido"
            value={profile.Apellido}
            onChangeText={(val) => handleInputChange('Apellido', val)}
          />
          <CustomInput
            label="Teléfono"
            placeholder="Ingresa tu número"
            value={profile.Telefono}
            onChangeText={(val) => handleInputChange('Telefono', val)}
            keyboardType="phone-pad"
          />
          <CustomInput
            label="Institución"
            placeholder="Ingresa tu institución"
            value={profile.Institucion}
            onChangeText={(val) => handleInputChange('Institucion', val)}
          />
          <CustomInput
            label="Cargo"
            placeholder="Ingresa tu cargo"
            value={profile.Cargo}
            onChangeText={(val) => handleInputChange('Cargo', val)}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleCompleteProfile} disabled={loading}>
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
    //textDecorationLine: 'underline',
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioOptionSelected: {
    // This style is no longer needed, but you can keep it empty or remove it
  },
  radioText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 5,
  },
  radioTextSelected: {
    fontWeight: 'bold',
  },
  datePickerContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 15,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#1F2937',
  },
});

export default RegisterProfileScreen;
