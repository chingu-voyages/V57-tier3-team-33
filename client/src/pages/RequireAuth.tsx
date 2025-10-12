import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RequireAuth = () => {
    const { user } = useAuth();
    const location = useLocation();

    return (
        user ? <Outlet /> : <Navigate to="/auth" state={{ from: location }} replace />
    )
}

export default RequireAuth
