import { useState, useEffect } from 'react';
import { getFacilities, reserveTime } from '../context/api';
import { useNavigate } from 'react-router-dom';

const ReservationForm = () => {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        const data = await getFacilities();
        setFacilities(data);
      } catch (err) {
        console.error('Error al cargar instalaciones:', err);
      }
    };
    loadFacilities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const reservationData = {
            facility_id: selectedFacility,
            start_time: new Date(startDateTime).toISOString(), // Convertir a ISO 8601
            end_time: new Date(endDateTime).toISOString()      // Convertir a ISO 8601
        };

        await reserveTime(reservationData); // Llama al API
        setMessage('Reserva realizada con éxito.');
        navigate(-1);
    } catch (err) {
        console.error('Error al realizar la reserva:', err.response?.data || err.message);
        setMessage('Error al realizar la reserva.');
    }
};


  return (
    <form onSubmit={handleSubmit} className="reservation-form">
      <h2>Reservar Instalación</h2>
      {message && <p>{message}</p>}
      <div>
        <label>Instalación:</label>
        <select
          value={selectedFacility}
          onChange={(e) => setSelectedFacility(e.target.value)}
          required
        >
          <option value="">Selecciona una instalación</option>
          {facilities.map((facility) => (
            <option key={facility.id} value={facility.id}>
              {facility.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Fecha y Hora de Inicio:</label>
        <input
          type="datetime-local"
          value={startDateTime}
          onChange={(e) => setStartDateTime(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Fecha y Hora de Fin:</label>
        <input
          type="datetime-local"
          value={endDateTime}
          onChange={(e) => setEndDateTime(e.target.value)}
          required
        />
      </div>
      <button type="submit">Reservar</button>
    </form>
  );
};

export default ReservationForm;
