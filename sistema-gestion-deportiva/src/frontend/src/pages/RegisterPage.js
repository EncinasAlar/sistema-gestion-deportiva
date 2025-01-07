import { useState } from 'react';
import { registerUser } from '../context/api';
import { useNavigate } from 'react-router-dom';
import '../styles/FormStyles.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dni: '',
    birthYear: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      setMessage({ type: 'success', text: 'Usuario registrado exitosamente.' });
      navigate('/');
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al registrar usuario. Intenta nuevamente.' });
    }
  };
  return (
    <div className="form-container">
      <h1>Registro de Usuario</h1>
      {message.text && (
        <p className={message.type === 'success' ? 'success-message' : 'error-message'}>
          {message.text}
        </p>
      )}
      <form onSubmit={handleSubmit} className="form">
        <label>Nombre:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        <label>Contraseña:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        <label>DNI:</label>
        <input type="text" name="dni" value={formData.dni} onChange={handleChange} required />
        <label>Año de Nacimiento:</label>
        <input type="number" name="birthYear" value={formData.birthYear} onChange={handleChange} required />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
  
};

export default RegisterPage;
