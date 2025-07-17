import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  // 1. Se importan los componentes nativos
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
// Se elimina la importación de KeyboardAwareScrollView
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
      {/* 2. Se reemplaza KeyboardAwareScrollView por la combinación nativa */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Contenido principal que se expandirá */}
          <View style={styles.mainContent}>
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
              label="Correo electrónico de contacto"
              placeholder="correo.contacto@dominio.com"
              value={formData.emailContacto}
              onChangeText={(val) => handleInputChange('emailContacto', val)}
              keyboardType="email-address"
              containerStyle={styles.inputContainer}
            />
          </View>

          {/* Footer con el botón */}
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
  mainContent: {
    flex: 1, // Hace que esta sección ocupe el espacio disponible
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  footer: {
    paddingTop: 10, // Espacio entre el último input y el botón
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
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 15,
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default Manuales2Screen;
