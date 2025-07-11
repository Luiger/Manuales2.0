import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// --- Explicación del Archivo ---
// Este servicio encapsula toda la lógica para comunicarse con el backend
// en lo que respecta a la autenticación.

// --- Constantes ---
// `API_URL`: La URL base de tu backend. Es una buena práctica tenerla en un
// archivo de configuración, pero por ahora la definimos aquí.
// Asegúrate de que el puerto coincida con el de tu backend.
const API_URL = 'https://03efb7791737.ngrok-free.app/api/auth'; // Ajustado al puerto 3000

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
// `login`: Función asíncrona que maneja la petición de inicio de sesión.
// Se añaden los tipos explícitos a los parámetros para cumplir con TypeScript.
const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data && response.data.token) {
      await SecureStore.setItemAsync('userToken', response.data.token);
      return { success: true, token: response.data.token };
    }
    return { success: false, error: 'Respuesta inesperada del servidor.' };
  } catch (error) {
    // --- 3. Manejo de Errores ---
    // Se maneja el error de tipo `unknown` de forma segura.
    let errorMessage = 'Ocurrió un error inesperado.';
    
    // Verificamos si el error es una instancia de AxiosError.
    if (axios.isAxiosError(error)) {
      // Si tiene una respuesta del servidor, usamos el mensaje de esa respuesta.
      if (error.response) {
        errorMessage = error.response.data.message || 'Error en la respuesta del servidor.';
      } else if (error.request) {
        // Si la petición se hizo pero no se recibió respuesta (ej. sin conexión).
        errorMessage = 'No se pudo conectar con el servidor.';
      }
    }
    
    console.error('Error en el servicio de login:', error);
    return { success: false, error: errorMessage };
  }
};

// --- Exportación ---
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
    // No devolvemos el error específico para no revelar si un email existe o no.
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

// Exportamos un objeto `AuthService` que contiene nuestra función `login`.
export const AuthService = {
  login,
  registerCredentials,
  registerProfile,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
