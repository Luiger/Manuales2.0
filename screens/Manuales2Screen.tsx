import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomInput from '../components/CustomInput';
import { FormService } from '../src/services/form.service';

interface ManualesFormData {
  emailPrincipal: string;
  nombreInstitucion: string;
  siglasInstitucion: string;
  unidadGestion: string;
  unidadSistemas: string;
  unidadContratante: string;
  personaContacto: string;
  telefono: string;
  emailContacto: string;
}

const Manuales2Screen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<ManualesFormData>({
    emailPrincipal: '',
    nombreInstitucion: '',
    siglasInstitucion: '',
    unidadGestion: '',
    unidadSistemas: '',
    unidadContratante: '',
    personaContacto: '',
    telefono: '',
    emailContacto: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyStatus = async () => {
      try {
        const { hasSubmitted } = await FormService.checkSubmissionStatus();
        if (hasSubmitted) {
          Alert.alert(
            'Límite alcanzado',
            'Ya has llenado este formulario.',
            [{ text: 'OK', onPress: () => router.back() }]
          );
        } else {
          setIsVerifying(false);
        }
      } catch (e) {
        Alert.alert('Error', 'No se pudo verificar el estado del formulario. Intenta de nuevo.');
        router.back();
      }
    };

    verifyStatus();
  }, []);

  const isFormValid =
    formData.emailPrincipal.trim() !== '' &&
    formData.nombreInstitucion.trim() !== '' &&
    formData.siglasInstitucion.trim() !== '' &&
    formData.unidadGestion.trim() !== '' &&
    formData.unidadSistemas.trim() !== '' &&
    formData.unidadContratante.trim() !== '' &&
    formData.personaContacto.trim() !== '' &&
    formData.telefono.trim() !== '' &&
    formData.emailContacto.trim() !== '';

  const handleInputChange = (name: keyof ManualesFormData, value: string) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!isFormValid) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload = {
        'Dirección de correo electrónico': formData.emailPrincipal,
        'Nombre de la Institución / Ente / Órgano': formData.nombreInstitucion,
        'Acrónimo y/o siglas de la Institución / Ente / Órgano': formData.siglasInstitucion,
        'Nombre de la Unidad / Gerencia y/u Oficina responsable de la Gestión Administrativa y Financiera de la Institución / Ente / Órgano': formData.unidadGestion,
        'Nombre de la Unidad / Gerencia y/u Oficina responsable del Área de Sistema y Tecnología de la Institución / Ente / Órgano': formData.unidadSistemas,
        'Nombre de la Unidad / Gerencia y/u Oficina que cumple funciones de Unidad Contratante en la Institución / Ente / Órgano': formData.unidadContratante,
        'Persona de contacto': formData.personaContacto,
        'Teléfono': formData.telefono,
        'Correo electrónico': formData.emailContacto,
      };
      const result = await FormService.submitManualContrataciones(payload);
      if (result.success) {
        Alert.alert(
          'Éxito',
          'Formulario enviado correctamente. Serás redirigido al inicio.',
          [{ text: 'OK', onPress: () => router.replace('/home') }]
        );
      } else {
        setError(result.error || 'Ocurrió un error al enviar el formulario.');
      }
    } catch (e) {
      setError('Ocurrió un error inesperado al enviar el formulario.');
    } finally {
      setLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

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
        <View style={styles.innerContainer}>
          <View>
            <View style={styles.formContainer}>
               <CustomInput
                label="Dirección de correo electrónico"
                placeholder="correo@institucion.com"
                value={formData.emailPrincipal}
                onChangeText={(val) => handleInputChange('emailPrincipal', val)}
                keyboardType="email-address"
                containerStyle={styles.inputContainer}
              />
              <CustomInput
                label="Nombre de la Institución / Ente / Órgano"
                placeholder="Ingrese el nombre completo"
                value={formData.nombreInstitucion}
                onChangeText={(val) => handleInputChange('nombreInstitucion', val)}
                containerStyle={styles.inputContainer}
              />
              <CustomInput
                label="Acrónimo / Siglas de la Institución"
                placeholder="Ej: MOPC"
                value={formData.siglasInstitucion}
                onChangeText={(val) => handleInputChange('siglasInstitucion', val)}
                containerStyle={styles.inputContainer}
              />
              <CustomInput
                label="Unidad Responsable (Gestión Adm. y Fin.)"
                placeholder="Ingrese la unidad de gestión"
                value={formData.unidadGestion}
                onChangeText={(val) => handleInputChange('unidadGestion', val)}
                containerStyle={styles.inputContainer}
              />
              <CustomInput
                label="Unidad Responsable (Sistemas y Tec.)"
                placeholder="Ingrese la unidad de tecnología"
                value={formData.unidadSistemas}
                onChangeText={(val) => handleInputChange('unidadSistemas', val)}
                containerStyle={styles.inputContainer}
              />
              <CustomInput
                label="Unidad Contratante"
                placeholder="Ingrese la unidad contratante"
                value={formData.unidadContratante}
                onChangeText={(val) => handleInputChange('unidadContratante', val)}
                containerStyle={styles.inputContainer}
              />
              <CustomInput
                label="Persona de contacto"
                placeholder="Nombre y Apellido"
                value={formData.personaContacto}
                onChangeText={(val) => handleInputChange('personaContacto', val)}
                containerStyle={styles.inputContainer}
              />
              <CustomInput
                label="Teléfono"
                placeholder="Ingrese el número de teléfono"
                value={formData.telefono}
                onChangeText={(val) => handleInputChange('telefono', val)}
                keyboardType="phone-pad"
                containerStyle={styles.inputContainer}
              />
              <CustomInput
                label="Correo electrónico de contacto"
                placeholder="correo.contacto@dominio.com"
                value={formData.emailContacto}
                onChangeText={(val) => handleInputChange('emailContacto', val)}
                keyboardType="email-address"
                containerStyle={styles.inputContainer}
              />
            </View>
          </View>

          <View style={styles.footer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity
              style={[styles.button, (!isFormValid || loading) && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!isFormValid || loading}
            >
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Enviar Formulario</Text>}
            </TouchableOpacity>
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
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  formContainer: {
  },
  footer: {
    paddingTop: 24,
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
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
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

export default Manuales2Screen;
