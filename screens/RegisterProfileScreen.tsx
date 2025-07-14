import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href, Link } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthService } from '../src/services/auth.service';
import Stepper from '../components/Stepper';
import CustomInput from '../components/CustomInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SecureStore from 'expo-secure-store';

const RegisterProfileScreen = () => {
  const router = useRouter();
  const [profile, setProfile] = useState({
    Nombre: '',
    Apellido: '',
    Telefono: '',
    Institucion: '',
    Cargo: ''
    //Genero: '',
    //FechaNacimiento: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  /*const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || profile.FechaNacimiento;
    setShowDatePicker(Platform.OS === 'ios');
    setProfile(prevState => ({ ...prevState, FechaNacimiento: currentDate }));
  };*/

  const handleCompleteProfile = async () => {
    // 2. Se añade la validación al presionar el botón como doble seguridad.
    if (!isFormValid) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    // 3. Se limpia el error antes de iniciar la carga.
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
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContainer}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={40}
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
          {/* 3. Se deshabilita el botón si el formulario no es válido o está cargando. */}
          {/* También se le aplica un estilo diferente. */}
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
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,
  },
  // 4. Nuevo estilo para el botón cuando está deshabilitado.
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
  inputContainer: {
    marginBottom: 15,
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
