import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerEstadisticas } from '../../services/api';
import { cerrarSesion } from '../../services/authService';

function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        obtenerEstadisticas().then(data => setStats(data));
    }, []);

    const tarjetas = stats ? [
        { label: 'Usuarios registrados', valor: stats.totalUsuarios,      color: '#2e7d32' },
        { label: 'Camiones activos',     valor: stats.camionesActivos,     color: '#1565c0' },
        { label: 'Reportes totales',     valor: stats.totalReportes,       color: '#6a1b9a' },
        { label: 'Reportes pendientes',  valor: stats.reportesPendientes,  color: '#e65100' },
    ] : [];

    return (
        <div>
            <nav className="navbar trashcol-navbar px-4">
                <span className="navbar-brand text-white">TrashCol — Admin</span>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/admin/reportes')}>Reportes</button>
                    <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/admin/camiones')}>Camiones</button>
                    <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/admin/usuarios')}>Usuarios</button>
                    <button className="btn btn-danger btn-sm" onClick={cerrarSesion}>Cerrar sesión</button>
                </div>
            </nav>

            <div className="dashboard-wrapper">
                <h3 className="text-center mt-4 mb-4">Panel de Administración</h3>

                {!stats && <p className="text-center text-muted">Cargando estadísticas...</p>}

                <div className="row g-3 mb-4">
                    {tarjetas.map((t) => (
                        <div key={t.label} className="col-6 col-md-3">
                            <div className="map-card text-center py-3" style={{ borderLeft: `4px solid ${t.color}` }}>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: t.color }}>{t.valor}</div>
                                <div style={{ fontSize: '13px', color: '#666' }}>{t.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row g-3">
                    {[
                        { ruta: '/admin/reportes', emoji: '📋', titulo: 'Gestionar Reportes', desc: 'Ver y cambiar estado' },
                        { ruta: '/admin/camiones', emoji: '🚛', titulo: 'Gestionar Camiones', desc: 'Alta, edición y estado' },
                        { ruta: '/admin/usuarios', emoji: '👥', titulo: 'Gestionar Usuarios', desc: 'Ver cuentas y roles' },
                    ].map((item) => (
                        <div key={item.ruta} className="col-md-4">
                            <div className="map-card text-center py-4"
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(item.ruta)}
                            >
                                <div style={{ fontSize: '2rem' }}>{item.emoji}</div>
                                <div style={{ fontWeight: 600 }}>{item.titulo}</div>
                                <div style={{ fontSize: '13px', color: '#666' }}>{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;