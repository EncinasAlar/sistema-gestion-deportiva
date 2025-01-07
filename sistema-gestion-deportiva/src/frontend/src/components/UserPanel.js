import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchUserReservations } from '../context/api';

const UserPanel = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const data = await fetchUserReservations(); // Devuelve reservas del usuario actual
        setReservations(data);
      } catch (err) {
        console.error('Error al obtener reservas:', err);
        setError('No se pudo cargar el historial de reservas.');
      }
    };

    loadReservations();
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="user-panel">
      <h2>¡Bienvenido de nuevo!</h2>
      <button onClick={() => navigate('/user/settings')}>Modificar Datos</button>
      <button onClick={() => navigate('/user/reserve')}>Crear Reserva</button>
      <h3>Historial de Reservas</h3>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <ul>
          {reservations.length > 0 ? (
            reservations.map((res) => (
              <li key={res.id}>
                <strong>{res.facility_name}</strong>: de{' '} {res.start_time} a{' '}
                {res.end_time}
              </li>
            ))
          ) : (
            <p>No tienes reservas registradas.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default UserPanel;
