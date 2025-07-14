import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { UserService } from '../src/services/user.service';
import CustomInput from '../components/CustomInput';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';

interface ProfileData {
    Nombre: string;
    Apellido: string;
    Telefono: string;
    Institucion: string;
    Cargo: string;
}
type ProfileField = keyof ProfileData;

const EditProfileScreen = () => {
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData>({
    Nombre: '',
    Apellido: '',
    Telefono: '',
    Institucion: '',
    Cargo: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await UserService.getProfile();
      if (response.success && response.data) {
        setProfileData(response.data);
      } else {
        Alert.alert('Error', 'No se pudieron cargar los datos del perfil.');
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleInputChange = (field: ProfileField, value: string) => {
    setProfileData((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setError('');
    const response = await UserService.updateProfile(profileData);
    if (response.success) {
      Alert.alert('Éxito', 'Perfil actualizado correctamente.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } else {
      setError(response.error || 'No se pudo guardar los cambios.');
    }
    setIsSaving(false);
  };
  
  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeftIcon size={28} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Editar Perfil</Text>
        
        <View style={styles.formWrapper}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Ahora se utiliza un estilo definido en la hoja de estilos */}
                <CustomInput
                    label="Nombre"
                    placeholder="Ingrese su nombre"
                    value={profileData.Nombre}
                    onChangeText={(val) => handleInputChange('Nombre', val)}
                    containerStyle={styles.inputContainer}
                />
                <CustomInput
                    label="Apellido"
                    placeholder="Ingrese su apellido"
                    value={profileData.Apellido}
                    onChangeText={(val) => handleInputChange('Apellido', val)}
                    containerStyle={styles.inputContainer}
                />
                <CustomInput
                    label="Teléfono"
                    placeholder="Ingrese su teléfono"
                    value={profileData.Telefono}
                    onChangeText={(val) => handleInputChange('Telefono', val)}
                    keyboardType="phone-pad"
                    containerStyle={styles.inputContainer}
                />
                <CustomInput
                    label="Institución"
                    placeholder="Ingrese su institución"
                    value={profileData.Institucion}
                    onChangeText={(val) => handleInputChange('Institucion', val)}
                    containerStyle={styles.inputContainer}
                />
                <CustomInput
                    label="Cargo"
                    placeholder="Ingrese su cargo"
                    value={profileData.Cargo}
                    onChangeText={(val) => handleInputChange('Cargo', val)}
                    // El último no necesita el estilo de margen inferior
                />
            </ScrollView>
        </View>

        <View style={styles.footer}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleSaveChanges} disabled={isSaving}>
            {isSaving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Guardar Cambios</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
  },
  backButton: {
    padding: 8,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center',
    marginBottom: 24,
  },
  formWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  // ✅ NUEVO: Estilo reutilizable para el espaciado de los inputs
  inputContainer: {
    marginBottom: 34,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  footer: {
    paddingVertical: 20,
  },
  button: { 
    width: '100%', 
    height: 50, 
    backgroundColor: '#1E3A8A', 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
});

export default EditProfileScreen;
