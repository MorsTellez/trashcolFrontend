import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerRutasAdmin, obtenerCamionesAdmin, crearRuta, toggleRutaActiva, eliminarRuta } from '../../services/api';

const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const COLORES = ['#e53935','#1e88e5','#43a047','#fb8c00','#8e24aa','#00acc1','#f4511e'];

// Componente para capturar clicks en el mapa
function CapturarPuntos({ activo, onPunto }) {
    useMapEvents({
        click(e) {
            if (activo) onPunto({ lat: e.latlng.lat, lng: e.latlng.lng });
        }
    });
    return null;
}

function AdminRutas() {
    const navigate = useNavigate();
    const [rutas, setRutas] = useState([]);
    const [camiones, setCamiones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mostrarForm, setMostrarForm] = useState(false);

    // Form
    const [form, setForm] = useState({ idCamion: '', nombre: '', diasSemana: [], horario: '' });
    const [puntos, setPuntos] = useState([]);
    const [trazando, setTrazando] = useState(false);
    const [error, setError] = useState('');
    const [guardando, setGuardando] = useState(false);

    const cargar = () => {
        setCargando(true);
        Promise.all([obtenerRutasAdmin(), obtenerCamionesAdmin()])
            .then(([r, c]) => {
                setRutas(Array.isArray(r) ? r : []);
                setCamiones(Array.isArray(c) ? c : []);
            })
            .finally(() => setCargando(false));
    };

    useEffect(() => { cargar(); }, []);

    const toggleDia = (dia) => {
        setForm(f => ({
            ...f,
            diasSemana: f.diasSemana.includes(dia)
                ? f.diasSemana.filter(d => d !== dia)
                : [...f.diasSemana, dia]
        }));
    };

    const handleGuardar = async () => {
        setError('');
        if (!form.idCamion || !form.nombre || form.diasSemana.length === 0 || !form.horario) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        if (puntos.length < 2) {
            setError('Traza al menos 2 puntos en el mapa.');
            return;
        }

        setGuardando(true);
        try {
            const data = await crearRuta({
                idCamion: parseInt(form.idCamion),
                nombre: form.nombre,
                diasSemana: form.diasSemana.join(','),
                horario: form.horario,
                puntos
            });

            if (data.ruta) {
                setMostrarForm(false);
                setPuntos([]);
                setForm({ idCamion: '', nombre: '', diasSemana: [], horario: '' });
                cargar();
            } else {
                setError(data.mensaje || 'Error creando ruta.');
            }
        } catch {
            setError('Error de conexión.');
        } finally {
            setGuardando(false);
        }
    };

    const handleToggle = async (ruta) => {
        await toggleRutaActiva(ruta.idruta, !ruta.activa);
        cargar();
    };

    const handleEliminar = async (id) => {
        if (!confirm('¿Eliminar esta ruta?')) return;
        await eliminarRuta(id);
        cargar();
    };

    return (
        <div>
            <nav className="navbar trashcol-navbar px-4">
                <span className="navbar-brand text-white">TrashCol — Admin</span>
                <button className="btn btn-light btn-sm" onClick={() => navigate('/admin')}>Volver</button>
            </nav>

            <div className="dashboard-wrapper">
                <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                    <h3 className="mb-0">Rutas de camiones</h3>
                    <button className="btn btn-success btn-sm" onClick={() => { setMostrarForm(true); setPuntos([]); setError(''); }}>
                        + Nueva ruta
                    </button>
                </div>

                {/* Formulario nueva ruta */}
                {mostrarForm && (
                    <div className="map-card mb-4">
                        <h5 className="mb-3">Nueva ruta</h5>
                        {error && <div className="alert-error">{error}</div>}

                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Camión</label>
                                <select className="form-select" value={form.idCamion}
                                    onChange={e => setForm({ ...form, idCamion: e.target.value })}>
                                    <option value="">Selecciona un camión</option>
                                    {camiones.map(c => (
                                        <option key={c.idcamion} value={c.idcamion}>
                                            {c.placa} — {c.chofer}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Nombre de la ruta</label>
                                <input className="form-control" placeholder="Ej: Colonia Centro"
                                    value={form.nombre}
                                    onChange={e => setForm({ ...form, nombre: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Horario</label>
                                <input type="time" className="form-control" value={form.horario}
                                    onChange={e => setForm({ ...form, horario: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Días de la semana</label>
                                <div className="d-flex flex-wrap gap-2 mt-1">
                                    {DIAS.map(dia => (
                                        <button key={dia}
                                            className={`btn btn-sm ${form.diasSemana.includes(dia) ? 'btn-success' : 'btn-outline-secondary'}`}
                                            onClick={() => toggleDia(dia)}
                                        >
                                            {dia.slice(0, 3)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Mapa para trazar la ruta */}
                        <div className="mb-2 d-flex align-items-center gap-3">
                            <button
                                className={`btn btn-sm ${trazando ? 'btn-danger' : 'btn-primary'}`}
                                onClick={() => setTrazando(!trazando)}
                            >
                                {trazando ? '⏹ Detener trazado' : '✏️ Trazar ruta en mapa'}
                            </button>
                            {puntos.length > 0 && (
                                <span className="text-muted" style={{ fontSize: '13px' }}>
                                    {puntos.length} puntos marcados
                                </span>
                            )}
                            {puntos.length > 0 && (
                                <button className="btn btn-sm btn-outline-danger" onClick={() => setPuntos([])}>
                                    Limpiar puntos
                                </button>
                            )}
                        </div>

                        {trazando && (
                            <div className="alert alert-info py-2 mb-2" style={{ fontSize: '13px' }}>
                                Haz clic en el mapa para agregar puntos de la trayectoria en orden
                            </div>
                        )}

                        <MapContainer center={[19.2456, -103.7245]} zoom={13}
                            style={{ height: '350px', width: '100%', borderRadius: '8px' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <CapturarPuntos activo={trazando} onPunto={p => setPuntos(pts => [...pts, p])} />
                            {puntos.map((p, i) => (
                                <Marker key={i} position={[p.lat, p.lng]} />
                            ))}
                            {puntos.length >= 2 && (
                                <Polyline
                                    positions={puntos.map(p => [p.lat, p.lng])}
                                    color="#2e7d32"
                                    weight={4}
                                />
                            )}
                        </MapContainer>

                        <div className="d-flex gap-2 mt-3">
                            <button className="btn btn-success" onClick={handleGuardar} disabled={guardando}>
                                {guardando ? 'Guardando...' : 'Guardar ruta'}
                            </button>
                            <button className="btn btn-outline-secondary" onClick={() => { setMostrarForm(false); setPuntos([]); }}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                {/* Lista de rutas */}
                <div className="map-card">
                    {cargando && <p className="text-center text-muted">Cargando rutas...</p>}
                    {!cargando && rutas.length === 0 && (
                        <p className="text-center text-muted">No hay rutas creadas aún.</p>
                    )}
                    {rutas.map((ruta, i) => (
                        <div key={ruta.idruta} className="reporte-card">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <div className="d-flex align-items-center gap-2">
                                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: COLORES[i % COLORES.length], display: 'inline-block' }}></span>
                                        <strong>{ruta.nombre}</strong>
                                        <span className={`badge ${ruta.activa ? 'bg-success' : 'bg-secondary'}`}>
                                            {ruta.activa ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#555', marginTop: 4 }}>
                                        🚛 {ruta.placa} — {ruta.chofer}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#555' }}>
                                        📅 {ruta.diasSemana} &nbsp; 🕐 {ruta.horario?.slice(0, 5)}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#888' }}>
                                        {ruta.total_puntos} puntos en la trayectoria
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        className={`btn btn-sm ${ruta.activa ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                                        onClick={() => handleToggle(ruta)}
                                    >
                                        {ruta.activa ? 'Desactivar' : 'Activar'}
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(ruta.idruta)}>
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminRutas;