import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerMisReportes } from '../services/api';

const ESTADO_BADGE = {
    pendiente:  { clase: 'bg-warning text-dark', texto: 'Pendiente' },
    en_proceso: { clase: 'bg-info text-dark',    texto: 'En proceso' },
    resuelto:   { clase: 'bg-success text-white', texto: 'Resuelto' },
    rechazado:  { clase: 'bg-danger text-white',  texto: 'Rechazado' },
};

function MisReportes() {
    const navigate = useNavigate();
    const [reportes, setReportes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        obtenerMisReportes()
            .then(data => {
                if (Array.isArray(data)) {
                    setReportes(data);
                } else {
                    setError('No se pudieron cargar los reportes.');
                }
            })
            .catch(() => setError('Error de conexión.'))
            .finally(() => setCargando(false));
    }, []);

    return (
        <div>
            <nav className="navbar trashcol-navbar px-4">
                <span className="navbar-brand text-white">TrashCol</span>
                <button
                    className="btn btn-light btn-sm"
                    onClick={() => navigate('/dashboard')}
                >
                    Volver
                </button>
            </nav>

            <div className="dashboard-wrapper">
                <h3 className="text-center mt-4 mb-3">Mis Reportes</h3>

                <div className="map-card">
                    {cargando && (
                        <p className="text-center text-muted">Cargando reportes...</p>
                    )}

                    {error && (
                        <div className="alert alert-danger">{error}</div>
                    )}

                    {!cargando && !error && reportes.length === 0 && (
                        <div className="text-center py-4">
                            <p className="text-muted">No has creado ningún reporte aún.</p>
                            <button
                                className="btn btn-success"
                                onClick={() => navigate('/crear-reportes')}
                            >
                                Crear mi primer reporte
                            </button>
                        </div>
                    )}

                    {reportes.map((reporte) => {
                        const badge = ESTADO_BADGE[reporte.estado] || ESTADO_BADGE.pendiente;
                        return (
                            <div key={reporte.idreporte} className="reporte-card">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <p className="mb-0" style={{ fontWeight: 500 }}>
                                        {reporte.descripcion}
                                    </p>
                                    <span className={`badge ${badge.clase} ms-2`}>
                                        {badge.texto}
                                    </span>
                                </div>
                                {reporte.foto && (
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}/uploads/${reporte.foto}`}
                                        alt="Foto del reporte"
                                        style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }}
                                    />
                                )}
                                <p className="text-muted mb-0" style={{ fontSize: '12px' }}>
                                    {new Date(reporte.fecha).toLocaleDateString('es-MX', {
                                        year: 'numeric', month: 'long', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default MisReportes;
