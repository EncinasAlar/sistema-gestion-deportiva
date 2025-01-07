import { useState } from 'react';
import { registerUser } from '../context/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dni: '',
    birthYear: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      setMessage({ type: 'success', text: 'Usuario registrado con éxito.' });
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      setMessage({ type: 'error', text: 'Error al registrar usuario.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Registro de Usuario</h2>
      {message.text && (
        <p style={{ color: message.type === 'success' ? 'green' : 'red' }}>
          {message.text}
        </p>
      )}
      <div>
        <label>Nombre:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Contraseña:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>DNI:</label>
        <input
          type="text"
          name="dni"
          value={formData.dni}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Año de Nacimiento:</label>
        <input
          type="number"
          name="birthYear"
          value={formData.birthYear}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Registrar</button>
    </form>
  );
};

export default Register;
