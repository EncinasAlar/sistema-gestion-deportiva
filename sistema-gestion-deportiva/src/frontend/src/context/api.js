import axios from 'axios';

const baseURL = 'http://localhost';

// Crear la instancia de Axios
const api = axios.create({
  baseURL, // Configura la base URL automáticamente según el entorno
});

// Interceptor para agregar el token JWT automáticamente a las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt'); // Obtener el token JWT del almacenamiento local
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//registrar usuario
export const registerUser = async (userData) => {
  try {
      const response = await api.post('/users/register', userData);
      return response.data;
  } catch (error) {
      console.error('Error al registrar usuario:', error.response?.data || error.message);
      throw error; // Lanza el error para manejarlo en el frontend
  }
};

// Iniciar sesión
export const loginUser = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  return response.data; // Retorna el token JWT
};
export const updateUser = async (userData) => {
  const response = await api.patch('/users/update', userData); // Ruta que gestiona los cambios
  return response.data;
};
//obtener el usuario autenticado
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    throw new Error('No se pudo obtener el usuario');
  }
};

// Actualizar el usuario autenticado
export const updateCurrentUser = async (data) => {
  try {
    const response = await api.put('/users/me', data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    throw new Error('No se pudo actualizar el usuario');
  }
};
// Obtener todos los usuarios
export const getUsers = async () => {
  const response = await api.get('/users/');
  return response.data;
};

// Eliminar un usuario
export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
}


// Obtener todas las instalaciones
export const getFacilities = async () => {
  const response = await api.get('/facilities');
  return response.data;
};

// Eliminar una instalación
export const deleteFacility = async (facilityId) => {
  const response = await api.delete(`/facilities/${facilityId}`);
  return response.data;
};

// Crear una nueva instalación
export const createFacility = async (facilityData) => {
  const response = await api.post('/facilities/', facilityData);
  return response.data;
};

// Obtener una instalación específica
export const getFacilityById = async (facilityId) => {
  const response = await api.get(`/facilities/${facilityId}`);
  return response.data;
};

// Reservar 
export const reserveTime = async (reservationData) => {
  const response = await api.post('/reservations/', reservationData);
  return response.data;
};

// Obtener reservas del usuario actual
export const fetchUserReservations = async () => {
  const response = await api.get('/reservations/'); // Endpoint para reservas del usuario
  return response.data;
};

export default api;
