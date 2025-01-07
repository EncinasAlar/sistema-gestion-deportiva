import { createContext, useContext, useState } from 'react';
import { loginUser, registerUser } from './api'; // Importa las funciones de tu API

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials); // Llama a la API para iniciar sesión
      const { token } = data; // Suponiendo que la API devuelve un objeto con el token
      localStorage.setItem('jwt', token); // Guarda el token en el localStorage

      // Decodifica el token para obtener información del usuario
      const userData = JSON.parse(atob(token.split('.')[1])); // Decodifica el payload del JWT
      setUser({ id: userData.sub, role: userData.role }); // Actualiza el estado del usuario
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      throw new Error('Inicio de sesión fallido. Verifica tus credenciales.');
    }
  };

  const register = async (userData) => {
    try {
      await registerUser(userData); // Llama a la API para registrar al usuario
      // Puedes redirigir al usuario o iniciar sesión automáticamente después del registro
    } catch (error) {
      console.error('Error al registrar usuario:', error.message);
      throw new Error('Registro fallido. Intenta de nuevo.');
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt'); // Elimina el token del localStorage
    setUser(null); // Limpia el estado del usuario
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
