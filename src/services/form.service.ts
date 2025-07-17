import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = `${process.env.API_URL}/manuales`;

interface FormSubmitResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface StatusCheckResponse {
  hasSubmitted: boolean;
}

const submitManualContrataciones = async (formData: object): Promise<FormSubmitResponse> => {
  try {
    const token = await SecureStore.getItemAsync('userToken');
    if (!token) {
      return { success: false, error: 'Usuario no autenticado.' };
    }

    const response = await axios.post(`${API_URL}/submit`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    let errorMessage = 'Ocurrió un error inesperado.';
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data.message || 'Error en la respuesta del servidor.';
    }
    return { success: false, error: errorMessage };
  }
};

const checkSubmissionStatus = async (): Promise<StatusCheckResponse> => {
  try {
    const token = await SecureStore.getItemAsync('userToken');
    if (!token) {
      return { hasSubmitted: false };
    }
    const response = await axios.get(`${API_URL}/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error checking submission status:', error);
    return { hasSubmitted: false };
  }
};

export const FormService = {
  submitManualContrataciones,
  checkSubmissionStatus,
};
