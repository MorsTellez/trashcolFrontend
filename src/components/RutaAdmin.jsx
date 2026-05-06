import { Navigate } from 'react-router-dom';

// Solo deja pasar si el usuario es administrador
function RutaAdmin({ children }) {
    const token = localStorage.getItem('token');
    const tipo = localStorage.getItem('tipoUsuario');

    if (!token) return <Navigate to="/" replace />;
    if (tipo !== 'administrador') return <Navigate to="/dashboard" replace />;

    return children;
}

export default RutaAdmin;