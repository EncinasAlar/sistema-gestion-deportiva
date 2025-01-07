import { useEffect, useState } from 'react';
import { fetchUserReservations } from '../context/api';

const ReservationHistory = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const data = await fetchUserReservations();
        setReservations(data);
      } catch (err) {
        console.error('Error al obtener reservas:', err);
        setError('No se pudo cargar el historial de reservas.');
      }
    };
    loadReservations();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Historial de Reservas</h2>
      <ul>
        {reservations.map((res) => (
          <li key={res.id}>
            {res.facility_name} - {res.start_time} a {res.end_time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReservationHistory;
