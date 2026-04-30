const API_URL = import.meta.env.VITE_API_URL;

// ========================
// Login
// ========================

export const login = async (correo, password) => {
    const response = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
    });
    return response.json();
};

// ========================
// Registro
// ========================

export const register = async (nombre, correo, password) => {
    const response = await fetch(`${API_URL}/usuarios/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, password })
    });
    return response.json();
};

// ========================
// Helpers de sesión
// ========================

export const getToken = () => localStorage.getItem('token');

export const getUsuario = () => {
    const nombre = localStorage.getItem('nombre');
    const tipo = localStorage.getItem('tipoUsuario');
    return { nombre, tipo };
};

export const cerrarSesion = () => {
    localStorage.clear();
    window.location.href = '/';
};
