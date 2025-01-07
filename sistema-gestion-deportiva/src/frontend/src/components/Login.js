import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../context/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook para la navegación

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await loginUser({ email, password });

      // Decodificar el token para obtener el rol del usuario
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join('')
      );
      const user = JSON.parse(jsonPayload);

      // Guardar el token en localStorage
      localStorage.setItem('jwt', token);

      // Redirigir según el rol
      if (user.role === 'admin') {
        navigate('/admin'); // Redirige al panel de administrador
      } else {
        navigate('/user'); // Redirige al panel de usuario
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Credenciales inválidas.');
      alert('Credenciales inválidas');
    }
  };

  const goToRegister = () => {
    navigate('/register'); // Navega a la página de registro
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Inicio de Sesión</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      <div className="register-link">
        <p>¿No tienes una cuenta?</p>
        <button onClick={goToRegister}>Regístrate</button>
      </div>
    </div>
  );
};

export default Login;
