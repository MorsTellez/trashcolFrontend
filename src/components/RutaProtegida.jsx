import { Navigate } from 'react-router-dom';

// Si no hay token en localStorage, redirige al login automáticamente
function RutaProtegida({ children }) {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default RutaProtegida;
