import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { UserService } from '../src/services/user.service';
import CustomInput from '../components/CustomInput';
import Stepper from '../components/Stepper';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';

const ChangePasswordScreen = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const steps = [
        { title: 'Verificar Contraseña' },
        { title: 'Establecer Nueva' },
    ];

    const handleVerifyPassword = async () => {
        if (!currentPassword) {
            setError('Por favor, ingresa tu contraseña actual.');
            return;
        }
        setLoading(true);
        setError('');
        const response = await UserService.verifyPassword(currentPassword);
        if (response.success) {
            setStep(2);
        } else {
            setError(response.error || 'La contraseña actual es incorrecta.');
        }
        setLoading(false);
    };

    const handleChangePassword = async () => {
        // Validación de campos vacíos
        if (!newPassword || !confirmPassword) {
            setError('Todos los campos son requeridos.');
            return;
        }

        // ✅ NUEVO: Validación de 8 caracteres mínimos
        if (newPassword.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        // Validación de coincidencia de contraseñas (ya existía)
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas nuevas no coinciden.');
            return;
        }

        setLoading(true);
        setError('');
        const response = await UserService.changePassword(newPassword);
        if (response.success) {
            Alert.alert('Éxito', 'Tu contraseña ha sido cambiada.', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } else {
            setError(response.error || 'No se pudo cambiar la contraseña.');
        }
        setLoading(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeftIcon size={28} color="#1F2937" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{flex: 1}}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer} 
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.titleContainer}>
                        <Text style={styles.mainTitle}>
                            {step === 1 ? 'Verificar Identidad' : 'Establecer Nueva Contraseña'}
                        </Text>
                        <Text style={styles.subtitle}>
                            {step === 1
                                ? 'Para continuar, ingresa tu contraseña actual.'
                                : 'Tu nueva contraseña debe ser segura.'
                            }
                        </Text>
                    </View>

                    <View style={styles.stepperWrapper}>
                        <Stepper steps={steps} currentStep={step} />
                    </View>

                    {step === 1 ? (
                        <View style={styles.formContainer}>
                            <CustomInput
                                label="Contraseña Actual"
                                placeholder="Ingresa tu contraseña actual"
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry
                                containerStyle={styles.inputContainer}
                            />
                            {error ? <Text style={styles.errorText}>{error}</Text> : null}
                            <TouchableOpacity style={styles.button} onPress={handleVerifyPassword} disabled={loading}>
                                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Verificar</Text>}
                            </TouchableOpacity>

                            <View style={styles.linkContainer}>
                                <Text style={styles.linkText}>¿Olvidaste tu Contraseña? </Text>
                                <Link href="/forgot-password" style={styles.link}>
                                    Ingresa aquí
                                </Link>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.formContainer}>
                            <CustomInput
                                label="Nueva Contraseña"
                                placeholder="Ingresa tu nueva contraseña"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry
                                containerStyle={styles.inputContainer}
                            />
                            <CustomInput
                                label="Confirmar Nueva Contraseña"
                                placeholder="Confirma tu nueva contraseña"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                containerStyle={styles.inputContainer}
                            />
                            {error ? <Text style={styles.errorText}>{error}</Text> : null}
                            <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={loading}>
                                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Guardar Cambios</Text>}
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
  },
  backButton: {
    padding: 8,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  stepperWrapper: {
    paddingHorizontal: '10%',
  },
  formContainer: {
    padding: 20,
    paddingTop: 30,
  },
  inputContainer: {
    marginBottom: 15,
  },
  button: { width: '100%', height: 50, backgroundColor: '#1E3A8A', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 10 },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  linkText: {
    fontSize: 14,
    color: '#6B7280',
  },
  link: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: 'bold',
  }
});

export default ChangePasswordScreen;
