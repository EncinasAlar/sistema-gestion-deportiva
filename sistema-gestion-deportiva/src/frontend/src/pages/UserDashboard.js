import { Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserPanel from '../components/UserPanel';
import ReservationForm from '../components/ReservationForm';
import ReservationHistory from '../components/ReservationHistory';
import UserSettings from '../components/UserSettings';
import '../styles/FormStyles.css';

const UserDashboard = () => {
  const { logout } = useAuth(); // Hook to access the logout function
  const navigate = useNavigate(); // Hook to navigate to another route

  const handleLogout = () => {
    logout(); // Clears the authentication state
    navigate('/'); // Redirects to the login page
  };
  return (
    <div className="form-container">
      <header className="dashboard-header">
        <h1>Panel de Usuario</h1>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </header>

      <Routes>
        <Route path="/" element={<UserPanel />} />
        <Route path="/reserve" element={<ReservationForm />} />
        <Route path="/reservations" element={<ReservationHistory />} />
        <Route path="/settings" element={<UserSettings />} />
      </Routes>

      <Outlet />
    </div>
  );
};
  

export default UserDashboard;
