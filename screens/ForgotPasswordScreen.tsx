import React, { useState } from 'react';
// 1. Se importan KeyboardAvoidingView y ScrollView de react-native
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { AuthService } from '../src/services/auth.service';
import CustomInput from '../components/CustomInput';
import Stepper from '../components/Stepper';
import * as SecureStore from 'expo-secure-store';
// Se elimina la importación de KeyboardAwareScrollView

const ForgotPasswordScreen = () => {
    const router = useRouter();
    
    const [step, setStep] = useState(1); 
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const steps = [
        { title: 'Enviar correo' },
        { title: 'Código' },
        { title: 'Recuperar Contraseña' },
    ];

    const handleSendEmail = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Por favor, introduce un correo electrónico válido.');
            return;
        }
        setLoading(true);
        setError('');
        await AuthService.forgotPassword(email);
        setLoading(false);
        setStep(2);
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            setError('Por favor, introduce un código de 6 dígitos.');
            return;
        }
        setLoading(true);
        setError('');
        const result = await AuthService.verifyOtp(email, otp);
        if (result.success && result.resetToken) {
            await SecureStore.setItemAsync('resetToken', result.resetToken);
            setStep(3);
        } else {
            setError(result.error || 'Código incorrecto o expirado.');
        }
        setLoading(false);
    };

    const handleResetPassword = async () => {
        if (!password || !confirmPassword) {
            setError('Todos los campos son requeridos.');
            return;
        }
        if (password.length < 8) {
            setError('La nueva contraseña debe tener al menos 8 caracteres.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        setLoading(true);
        setError('');
        const resetToken = await SecureStore.getItemAsync('resetToken');
        if (!resetToken) {
            setError('Sesión inválida. Por favor, inicia el proceso de nuevo.');
            setLoading(false);
            return;
        }
        const result = await AuthService.resetPassword(password, resetToken);
        if (result.success) {
            await SecureStore.deleteItemAsync('resetToken');
            Alert.alert('Éxito', 'Tu contraseña ha sido actualizada. Por favor, inicia sesión.', [
                { text: 'OK', onPress: () => router.replace('/login') }
            ]);
        } else {
            setError(result.error || 'Ocurrió un error al restablecer la contraseña.');
        }
        setLoading(false);
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <View style={styles.formContainer}>
                        <CustomInput
                            label="Correo electrónico"
                            placeholder="Ingresa tu correo"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            containerStyle={styles.inputContainer}
                        />
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                        <TouchableOpacity style={styles.button} onPress={handleSendEmail} disabled={loading}>
                            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Enviar</Text>}
                        </TouchableOpacity>
                    </View>
                );
            case 2:
                return (
                    <View style={styles.formContainer}>
                        <CustomInput
                            label="Código de Verificación"
                            placeholder="123456"
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="number-pad"
                            maxLength={6}
                            containerStyle={styles.inputContainer}
                        />
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                        <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={loading}>
                            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Verificar</Text>}
                        </TouchableOpacity>
                    </View>
                );
            case 3:
                return (
                    <View style={styles.formContainer}>
                        <CustomInput
                            label="Nueva Contraseña"
                            placeholder="Mínimo 8 caracteres"
                            value={password}
                            onChangeText={setPassword}
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
                        <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
                            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Actualizar Contraseña</Text>}
                        </TouchableOpacity>
                    </View>
                );
            default:
                return null;
        }
    };

    const getTitle = () => {
        switch(step) {
            case 1: return 'Recuperar Contraseña';
            case 2: return 'Verificar Código';
            case 3: return 'Establecer Nueva Contraseña';
            default: return '';
        }
    };

    const getSubtitle = () => {
        switch(step) {
            case 1: 
                return <Text style={styles.subtitle}>Ingresa el correo electrónico asociado a tu cuenta.</Text>;
            case 2: 
                return (
                    <Text style={styles.subtitle}>
                        Hemos enviado un código a{'\n'}
                        <Text style={{fontWeight: 'bold'}}>{email}</Text>
                    </Text>
                );
            case 3: 
                return <Text style={styles.subtitle}>Tu nueva contraseña debe ser segura.</Text>;
            default: 
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* 2. Se reemplaza KeyboardAwareScrollView por la combinación de KeyboardAvoidingView y ScrollView */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingContainer}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.titleContainer}>
                        <Text style={styles.mainTitle}>{getTitle()}</Text>
                        {getSubtitle()}
                    </View>

                    <View style={styles.stepperWrapper}>
                        <Stepper steps={steps} currentStep={step} />
                    </View>

                    {renderStepContent()}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB',
    paddingTop: 60,
  },
  // 3. Estilos para los nuevos componentes de layout
  keyboardAvoidingContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 15,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  titleContainer: {
    // No necesita cambios
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
    paddingHorizontal: '5%',
    marginBottom: 20,
  },
  formContainer: {
    // No necesita cambios
  },
  button: { width: '100%', height: 50, backgroundColor: '#1E3A8A', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 15 },
});

export default ForgotPasswordScreen;
