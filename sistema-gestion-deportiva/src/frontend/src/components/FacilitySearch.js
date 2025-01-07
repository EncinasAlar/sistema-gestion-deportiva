import { useState } from 'react';
import { searchFacilities } from '../context/api';

const FacilitySearch = () => {
  const [type, setType] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const data = await searchFacilities(type, new Date(availableFrom));
      setResults(data);
      setError('');
    } catch (err) {
      console.error('Error al buscar instalaciones:', err);
      setError('No se pudo realizar la búsqueda.');
    }
  };

  return (
    <div className="facility-search">
      <h2>Buscar Instalaciones</h2>
      <div>
        <label>Tipo:</label>
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Ej: Gimnasio"
        />
      </div>
      <div>
        <label>Disponible Desde:</label>
        <input
          type="datetime-local"
          value={availableFrom}
          onChange={(e) => setAvailableFrom(e.target.value)}
        />
      </div>
      <button onClick={handleSearch}>Buscar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {results.map((facility) => (
          <li key={facility.id}>
            {facility.name} ({facility.type})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FacilitySearch;
