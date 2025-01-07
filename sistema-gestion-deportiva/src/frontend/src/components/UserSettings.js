import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateCurrentUser } from '../context/api';

const UserSettings = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Función para obtener los datos del usuario desde el backend
  const fetchUserData = async () => {
    try {
      const data = await getCurrentUser();
      setUserData(data);
      setEmail(data.email || ''); // Inicializa el campo de email con los datos obtenidos
    } catch (error) {
      console.error(error);
      setMessage('Error al cargar los datos del usuario.');
    }
  };

  useEffect(() => {
    fetchUserData(); // Llama a la función para obtener los datos del usuario
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateCurrentUser({ email, password });
      setMessage('Datos actualizados correctamente.');
      setTimeout(() => navigate('/user'), 2000);
    } catch (err) {
      console.error(err);
      setMessage('Error al actualizar los datos.');
    }
  };

  if (!userData) {
    return <p>Cargando datos del usuario...</p>;
  }

  return (
    <div className="user-settings">
      <button onClick={() => navigate(-1)}>Volver Atrás</button>
      <form onSubmit={handleSubmit} className="user-settings-form">
        <h2>Modificar Datos</h2>
        {message && <p>{message}</p>}
        <div>
          <label>Nombre:</label>
          <p>{userData.name}</p>
        </div>
        <div>
          <label>DNI:</label>
          <p>{userData.dni}</p>
        </div>
        <div>
          <label>Año de Nacimiento:</label>
          <p>{userData.birthYear}</p>
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Actualizar Datos</button>
      </form>
    </div>
  );
};

export default UserSettings;
