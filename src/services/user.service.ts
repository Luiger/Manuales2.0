import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = `${process.env.API_URL}/user`; // URL base para la API de usuario

// Define una interfaz para los datos del perfil que vienen del backend
interface ProfileData {
  Nombre: string;
  Apellido: string;
  Telefono: string;
  Institucion: string;
  Cargo: string;
  Email: string;
}

interface ApiResponse {
    success: boolean;
    message?: string;
    error?: string;
    data?: any;
}

const getAuthHeaders = async () => {
    const token = await SecureStore.getItemAsync('userToken');
    if (!token) throw new Error('Token no encontrado');
    return { Authorization: `Bearer ${token}` };
};

const getProfile = async (): Promise<ApiResponse & { data?: ProfileData }> => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API_URL}/profile`, { headers });
        return response.data;
    } catch (error) {
        // Manejar errores...
        return { success: false, error: 'Error al obtener el perfil.' };
    }
};

const updateProfile = async (profileData: Partial<ProfileData>): Promise<ApiResponse> => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.put(`${API_URL}/profile`, profileData, { headers });
        return response.data;
    } catch (error) {
        return { success: false, error: 'Error al actualizar el perfil.' };
    }
};

const verifyPassword = async (currentPassword: string): Promise<ApiResponse> => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.post(`${API_URL}/password/verify`, { currentPassword }, { headers });
        return response.data;
    } catch (error) {
        return { success: false, error: 'La contraseña es incorrecta.' };
    }
};

const changePassword = async (newPassword: string): Promise<ApiResponse> => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.put(`${API_URL}/password/change`, { newPassword }, { headers });
        return response.data;
    } catch (error) {
        return { success: false, error: 'Error al cambiar la contraseña.' };
    }
};

export const UserService = {
    getProfile,
    updateProfile,
    verifyPassword,
    changePassword,
};
