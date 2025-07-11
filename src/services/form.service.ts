import axios from 'axios';

// --- Explicación del Archivo ---
// Este servicio maneja el envío de formularios a la API del backend.
// Sigue la misma estructura y buenas prácticas que auth.service.ts.

// --- Constantes ---
// La URL base para los endpoints de formularios/manuales.
// Apunta a la nueva ruta que manejará nuestro manuales.controller.js
const API_URL = 'https://03efb7791737.ngrok-free.app/api/manuales';

// --- Interfaces ---
// Define la estructura de la respuesta esperada para cualquier envío de formulario.
interface FormSubmitResponse {
  success: boolean;
  message?: string; // Mensaje de éxito
  error?: string;   // Mensaje de error
}

/**
 * Envía los datos del formulario de Manual de Contrataciones al backend.
 * @param formData - Objeto con los datos del formulario.
 * @returns Una promesa que resuelve a un objeto FormSubmitResponse.
 */
const submitManualContrataciones = async (formData: object): Promise<FormSubmitResponse> => {
  try {
    // Hacemos la petición al endpoint específico. El backend espera el objeto formData.
    const response = await axios.post(`${API_URL}/submit`, formData);

    // Si la petición es exitosa (status 2xx), devolvemos los datos de la respuesta.
    // El backend debería devolver { success: true, message: '...' }
    return response.data;

  } catch (error) {
    // --- Manejo de Errores Estandarizado ---
    // Idéntico al de auth.service.ts para mantener consistencia.
    let errorMessage = 'Ocurrió un error inesperado al enviar el formulario.';

    if (axios.isAxiosError(error)) {
      if (error.response) {
        // El servidor respondió con un error (ej. 400, 500).
        errorMessage = error.response.data.message || 'Error en la respuesta del servidor.';
      } else if (error.request) {
        // La petición se hizo pero no se recibió respuesta.
        errorMessage = 'No se pudo conectar con el servidor. Revisa tu conexión a internet.';
      }
    }
    
    console.error('Error en el servicio submitManualContrataciones:', error);
    return { success: false, error: errorMessage };
  }
};

// --- Exportación ---
// Exportamos un objeto FormService que agrupa todas las funciones relacionadas
// con formularios, manteniendo el código organizado.
export const FormService = {
  submitManualContrataciones,
};
