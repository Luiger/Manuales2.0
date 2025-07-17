import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// --- Explicación del Archivo ---
// Este servicio encapsula toda la lógica para comunicarse con el backend
// en lo que respecta a la autenticación.

// --- Constantes ---
const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/auth`;

// --- Interfaces ---
interface AuthResponse {
  success: boolean;
  error?: string;
  token?: string;
}

interface VerifyOtpResponse {
  success: boolean;
  error?: string;
  resetToken?: string;
}

interface RegisterCredentialsResponse {
  success: boolean;
  error?: string;
  tempToken?: string;
}

// --- Función de Login ---
const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data && response.data.token) {
      await SecureStore.setItemAsync('userToken', response.data.token);
      return { success: true, token: response.data.token };
    }
    return { success: false, error: 'Respuesta inesperada del servidor.' };
  } catch (error) {
    let errorMessage = 'Ocurrió un error inesperado.';
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage = error.response.data.message || 'Error en la respuesta del servidor.';
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor.';
      }
    }
    
    console.error('Error en el servicio de login:', error);
    return { success: false, error: errorMessage };
  }
};

// --- Función de Registro (Paso 1: Credenciales) ---
const registerCredentials = async (email: string, password: string): Promise<RegisterCredentialsResponse> => {
  try {
    const response = await axios.post(`${API_URL}/register/credentials`, { email, password });
    if (response.data && response.data.tempToken) {
      return { success: true, tempToken: response.data.tempToken };
    }
    return { success: false, error: 'Respuesta inesperada del servidor.' };
  } catch (error) {
    let errorMessage = 'Ocurrió un error inesperado.';
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data.message || 'Error en la respuesta del servidor.';
    }
    return { success: false, error: errorMessage };
  }
};

// --- Función de Registro (Paso 2: Perfil) ---
const registerProfile = async (profileData: any, tempToken: string): Promise<AuthResponse> => {
  try {
    await axios.post(`${API_URL}/register/profile`, profileData, {
      headers: { Authorization: `Bearer ${tempToken}` },
    });
    return { success: true };
  } catch (error) {
    let errorMessage = 'Ocurrió un error inesperado.';
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data.message || 'Error en la respuesta del servidor.';
    }
    return { success: false, error: errorMessage };
  }
};

// --- Función para Solicitar Recuperación de Contraseña ---
const forgotPassword = async (email: string): Promise<AuthResponse> => {
  try {
    await axios.post(`${API_URL}/forgot-password`, { email });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Si el correo existe, se ha enviado un enlace.' };
  }
};

// --- Función para Resetear la Contraseña ---
const resetPassword = async (password: string, resetToken: string): Promise<AuthResponse> => {
  try {
    await axios.post(`${API_URL}/reset-password`, { password }, {
      headers: { Authorization: `Bearer ${resetToken}` },
    });
    return { success: true };
  } catch (error) {
    let errorMessage = 'Ocurrió un error inesperado.';
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data.message || 'Error en la respuesta del servidor.';
    }
    return { success: false, error: errorMessage };
  }
};

// --- Función para Verificar el Código OTP ---
const verifyOtp = async (email: string, otp: string): Promise<VerifyOtpResponse> => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
    if (response.data && response.data.resetToken) {
      return { success: true, resetToken: response.data.resetToken };
    }
    return { success: false, error: 'Respuesta inesperada del servidor.' };
  } catch (error) {
    let errorMessage = 'Ocurrió un error inesperado.';
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data.message || 'Error en la respuesta del servidor.';
    }
    return { success: false, error: errorMessage };
  }
};

// --- ✅ NUEVA FUNCIÓN DE LOGOUT ---
// Limpia los datos de sesión del dispositivo para desloguear al usuario.
const logout = async (): Promise<void> => {
  try {
    // Elimina el token de usuario que mantiene la sesión activa.
    await SecureStore.deleteItemAsync('userToken');
  } catch (error) {
    console.error('Error durante el logout en el servicio:', error);
    // No es necesario lanzar un error aquí, el objetivo es desloguear al usuario.
  }
};

// --- ✅ EXPORTACIÓN ACTUALIZADA ---
// Añadimos la nueva función 'logout' al objeto exportado.
export const AuthService = {
  login,
  registerCredentials,
  registerProfile,
  forgotPassword,
  verifyOtp,
  resetPassword,
  logout, // <-- AÑADIDO
};
