import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
    const { user, loading } = useAuth();

    return (
        loading ? null : (user ? <Outlet /> : <Navigate to="/auth" replace />)
    )
}

export default RequireAuth
