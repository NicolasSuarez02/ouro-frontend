import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  const token = localStorage.getItem('ouro_token');
  const raw = localStorage.getItem('ouro_user');
  if (!token || !raw) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  if (requiredRole) {
    try {
      const user = JSON.parse(raw);
      if (user.role !== requiredRole) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    } catch {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
  }

  return children;
};

export default PrivateRoute;
