import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// --- Explicación del Archivo ---
// Este servicio encapsula toda la lógica para comunicarse con el backend
// en lo que respecta a la autenticación.

// --- Constantes ---
// `API_URL`: La URL base de tu backend. Es una buena práctica tenerla en un
// archivo de configuración, pero por ahora la definimos aquí.
// Asegúrate de que el puerto coincida con el de tu backend.
const API_URL = 'https://4cd1bc79ac2b.ngrok-free.app/api/auth'; // Ajustado al puerto 3000

// --- Interfaz de Respuesta ---
// Define la forma que tendrá el objeto de respuesta de nuestra función de login.
interface AuthResponse {
  success: boolean;
  error?: string;
}

// --- Función de Login ---
// `login`: Función asíncrona que maneja la petición de inicio de sesión.
// Se añaden los tipos explícitos a los parámetros para cumplir con TypeScript.
const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // --- 1. Petición al Backend ---
    // `axios.post`: Envía una petición POST al endpoint '/login'.
    // El segundo argumento es el cuerpo de la petición, con el email y la contraseña.
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    // --- 2. Manejo de Respuesta Exitosa ---
    // Si la petición fue exitosa (código 2xx), el backend nos devuelve un token.
    if (response.data && response.data.token) {
      // `SecureStore.setItemAsync`: Guarda el token de forma segura en el dispositivo.
      // 'userToken' es la clave con la que lo guardamos.
      await SecureStore.setItemAsync('userToken', response.data.token);
      return { success: true };
    } else {
      // Si la respuesta no tiene el formato esperado.
      return { success: false, error: 'Respuesta inesperada del servidor.' };
    }
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
// Exportamos un objeto `AuthService` que contiene nuestra función `login`.
export const AuthService = {
  login,
};
