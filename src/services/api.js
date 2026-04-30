const API_URL = import.meta.env.VITE_API_URL;

// Función base que agrega el token Bearer automáticamente
const fetchConToken = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    });

    // Si el token expiró o no es válido, redirigir al login
    if (response.status === 401 || response.status === 400) {
        localStorage.clear();
        window.location.href = '/';
        return;
    }

    return response.json();
};

// ========================
// Reportes
// ========================

export const crearReporte = (descripcion, latitud, longitud, foto) => {
    const token = localStorage.getItem('token');

    // Usamos FormData para poder enviar la foto (archivo)
    const formData = new FormData();
    formData.append('descripcion', descripcion);
    formData.append('latitud', latitud);
    formData.append('longitud', longitud);
    if (foto) formData.append('foto', foto);

    return fetch(`${API_URL}/reportes/crear`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    }).then(res => res.json());
};

export const obtenerMisReportes = () =>
    fetchConToken('/reportes/mis-reportes');

export const obtenerTodosReportes = () =>
    fetchConToken('/reportes/todos');

// ========================
// Camiones
// ========================

export const obtenerCamiones = () =>
    fetchConToken('/camiones/todos');

export const obtenerUbicacionCamion = (idCamion) =>
    fetchConToken(`/camiones/ubicacion/${idCamion}`);
