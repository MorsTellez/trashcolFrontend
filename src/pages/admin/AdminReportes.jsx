import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerReportesAdmin, actualizarEstadoReporte } from '../../services/api';

const ESTADOS = ['todos', 'pendiente', 'en_proceso', 'resuelto', 'rechazado'];

const BADGE = {
    pendiente:  { clase: 'bg-warning text-dark', texto: 'Pendiente' },
    en_proceso: { clase: 'bg-info text-dark',    texto: 'En proceso' },
    resuelto:   { clase: 'bg-success text-white', texto: 'Resuelto' },
    rechazado:  { clase: 'bg-danger text-white',  texto: 'Rechazado' },
};

function AdminReportes() {
    const navigate = useNavigate();
    const [reportes, setReportes] = useState([]);
    const [filtro, setFiltro] = useState('todos');
    const [cargando, setCargando] = useState(true);

    const cargar = (estado) => {
        setCargando(true);
        obtenerReportesAdmin(estado === 'todos' ? '' : estado)
            .then(data => setReportes(Array.isArray(data) ? data : []))
            .finally(() => setCargando(false));
    };

    useEffect(() => { cargar(filtro); }, [filtro]);

    const cambiarEstado = async (id, nuevoEstado) => {
        await actualizarEstadoReporte(id, nuevoEstado);
        cargar(filtro);
    };

    return (
        <div>
            <nav className="navbar trashcol-navbar px-4">
                <span className="navbar-brand text-white">TrashCol — Admin</span>
                <button className="btn btn-light btn-sm" onClick={() => navigate('/admin')}>Volver</button>
            </nav>

            <div className="dashboard-wrapper">
                <h3 className="text-center mt-4 mb-3">Reportes Ciudadanos</h3>

                {/* Filtros */}
                <div className="d-flex gap-2 flex-wrap mb-3">
                    {ESTADOS.map(e => (
                        <button
                            key={e}
                            className={`btn btn-sm ${filtro === e ? 'btn-success' : 'btn-outline-secondary'}`}
                            onClick={() => setFiltro(e)}
                        >
                            {e === 'todos' ? 'Todos' : BADGE[e]?.texto}
                        </button>
                    ))}
                </div>

                <div className="map-card">
                    {cargando && <p className="text-center text-muted">Cargando...</p>}

                    {!cargando && reportes.length === 0 && (
                        <p className="text-center text-muted">No hay reportes con este filtro.</p>
                    )}

                    {reportes.map((r) => {
                        const badge = BADGE[r.estado] || BADGE.pendiente;
                        return (
                            <div key={r.idreporte} className="reporte-card">
                                <div className="d-flex justify-content-between align-items-start mb-1">
                                    <div>
                                        <strong>{r.nombre_usuario}</strong>
                                        <span className="text-muted" style={{ fontSize: '12px' }}> — {new Date(r.fecha).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <span className={`badge ${badge.clase}`}>{badge.texto}</span>
                                </div>

                                <p className="mb-2">{r.descripcion}</p>

                                {r.foto && (
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}/uploads/${r.foto}`}
                                        alt="foto reporte"
                                        style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }}
                                    />
                                )}

                                <div className="d-flex gap-2 flex-wrap mt-2">
                                    {['pendiente', 'en_proceso', 'resuelto', 'rechazado']
                                        .filter(e => e !== r.estado)
                                        .map(e => (
                                            <button
                                                key={e}
                                                className={`btn btn-sm ${BADGE[e].clase.replace('text-dark','').replace('text-white','')}`}
                                                onClick={() => cambiarEstado(r.idreporte, e)}
                                            >
                                                → {BADGE[e].texto}
                                            </button>
                                        ))
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default AdminReportes;