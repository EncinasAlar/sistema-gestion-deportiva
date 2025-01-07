import { useState, useEffect } from 'react';
import { getFacilities, createFacility, getUsers, deleteUser, deleteFacility } from '../context/api';

const AdminPanel = () => {
  const [facilities, setFacilities] = useState([]);
  const [users, setUsers] = useState([]);
  const [newFacility, setNewFacility] = useState({
    name: '',
    type: '',
    description: '',
    available_times: [],
  });
  const [message, setMessage] = useState('');

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        const facilitiesData = await getFacilities();
        const usersData = await getUsers();
        setFacilities(facilitiesData);
        setUsers(usersData);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    };
    loadData();
  }, []);

  // Manejar la eliminación de un usuario
  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId); // Llama a la función de eliminación
      setUsers(users.filter((user) => user._id !== userId)); // Filtra al usuario eliminado
      setMessage('Usuario eliminado exitosamente.');
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      setMessage('Error al eliminar usuario.');
    }
  };

  // Manejar la eliminación de una instalación
  const handleDeleteFacility = async (facilityId) => {
    try {
      await deleteFacility(facilityId);
      setFacilities(facilities.filter((facility) => facility.id !== facilityId));
      setMessage('Instalación eliminada exitosamente.');
    } catch (err) {
      console.error('Error al eliminar instalación:', err);
      setMessage('Error al eliminar instalación.');
    }
  };

  // Manejar la creación de una nueva instalación
  const handleCreateFacility = async () => {
    try {
      const createdFacility = await createFacility(newFacility);
      setFacilities([...facilities, createdFacility]);
      setNewFacility({
        name: '',
        type: '',
        description: '',
        available_times: [],
      });
      setMessage('Instalación creada exitosamente.');
    } catch (err) {
      console.error('Error al crear instalación:', err);
      setMessage('Error al crear instalación.');
    }
  };

  return (
    <div className="admin-panel">
      <h2>Panel de Administración</h2>
      {message && <p>{message}</p>}

      {/* Gestión de Usuarios */}
      <div>
        <h3>Usuarios</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} ({user.email}){' '}
              <button onClick={() => handleDeleteUser(user._id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Gestión de Instalaciones */}
      <div>
        <h3>Instalaciones</h3>
        <ul>
          {facilities.map((facility) => (
            <li key={facility.id}>
              {facility.name} ({facility.type}){' '}
              <button onClick={() => handleDeleteFacility(facility.id)}>Eliminar</button>
            </li>
          ))}
        </ul>

        {/* Crear nueva instalación */}
        <div>
          <h4>Crear Nueva Instalación</h4>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              value={newFacility.name}
              onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Tipo:</label>
            <input
              type="text"
              value={newFacility.type}
              onChange={(e) => setNewFacility({ ...newFacility, type: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Descripción:</label>
            <input
              type="text"
              value={newFacility.description}
              onChange={(e) => setNewFacility({ ...newFacility, description: e.target.value })}
            />
          </div>
          <button onClick={handleCreateFacility}>Crear Instalación</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
