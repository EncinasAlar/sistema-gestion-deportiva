import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel';
import '../styles/FormStyles.css';

const AdminDashboard = () => {
  const { logout } = useAuth(); // Hook to access the logout function
  const navigate = useNavigate(); // Hook to navigate to another route

  const handleLogout = () => {
    logout(); // Clears the authentication state
    navigate('/'); // Redirects to the login page
  };

  return (
    <div className="form-container">
      <header className="dashboard-header">
        <h1>Panel de Administrador</h1>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </header>
      <AdminPanel />
    </div>
  );
};

export default AdminDashboard;
