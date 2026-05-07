import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { cerrarSesion, getUsuario } from '../services/authService';
import { obtenerRutas } from '../services/api';

const COLORES = ['#e53935','#1e88e5','#43a047','#fb8c00','#8e24aa','#00acc1','#f4511e'];

const iconoUsuario = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    iconSize: [35, 35]
});

const iconoCamion = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2343/2343983.png',
    iconSize: [38, 38]
});

function Dashboard() {
    const navigate = useNavigate();
    const [posicion, setPosicion] = useState([19.2456, -103.7245]);
    const [rutas, setRutas] = useState([]);
    const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
    const { nombre } = getUsuario();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => setPosicion([pos.coords.latitude, pos.coords.longitude]),
            () => {}
        );
        obtenerRutas().then(data => {
            if (Array.isArray(data)) setRutas(data);
        });
    }, []);

    return (
        <div>
            <nav className="navbar trashcol-navbar px-4">
                <span className="navbar-brand text-white">TrashCol</span>
                <div className="d-flex align-items-center gap-3">
                    <span className="text-white">{nombre || 'Usuario'}</span>
                    <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/mis-reportes')}>
                        Mis reportes
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={cerrarSesion}>
                        Cerrar sesión
                    </button>
                </div>
            </nav>

            <div className="dashboard-wrapper">
                <h3 className="text-center mt-4 mb-2">Mapa de Rutas</h3>

                <div className="text-center mb-3">
                    <button className="btn btn-success me-2" onClick={() => navigate('/crear-reportes')}>
                        Crear Reporte
                    </button>
                </div>

                {/* Panel de rutas disponibles */}
                {rutas.length > 0 && (
                    <div className="map-card mb-3">
                        <p className="mb-2" style={{ fontWeight: 600, fontSize: '14px' }}>
                            Rutas activas — haz clic para verla en el mapa:
                        </p>
                        <div className="d-flex flex-wrap gap-2">
                            {rutas.map((ruta, i) => (
                                <button
                                    key={ruta.idruta}
                                    className={`btn btn-sm ${rutaSeleccionada?.idruta === ruta.idruta ? 'btn-dark' : 'btn-outline-dark'}`}
                                    style={{ borderLeft: `4px solid ${COLORES[i % COLORES.length]}` }}
                                    onClick={() => setRutaSeleccionada(
                                        rutaSeleccionada?.idruta === ruta.idruta ? null : ruta
                                    )}
                                >
                                    🚛 {ruta.nombre}
                                </button>
                            ))}
                        </div>

                        {/* Info de la ruta seleccionada */}
                        {rutaSeleccionada && (
                            <div className="mt-3 p-2" style={{ background: '#f5f5f5', borderRadius: 6, fontSize: '13px' }}>
                                <strong>{rutaSeleccionada.nombre}</strong> &nbsp;—&nbsp;
                                Camión: {rutaSeleccionada.placa} ({rutaSeleccionada.chofer}) &nbsp;|&nbsp;
                                📅 {rutaSeleccionada.diasSemana} &nbsp;|&nbsp;
                                🕐 {rutaSeleccionada.horario?.slice(0, 5)} hrs
                            </div>
                        )}
                    </div>
                )}

                <div className="map-card">
                    <MapContainer center={posicion} zoom={14} style={{ height: '480px', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {/* Ubicación del usuario */}
                        <Marker position={posicion} icon={iconoUsuario}>
                            <Popup>Tu ubicación actual</Popup>
                        </Marker>

                        {/* Dibujar todas las rutas en gris tenue */}
                        {rutas.map((ruta, i) => {
                            if (ruta.puntos.length < 2) return null;
                            const esSeleccionada = rutaSeleccionada?.idruta === ruta.idruta;
                            return (
                                <Polyline
                                    key={ruta.idruta}
                                    positions={ruta.puntos.map(p => [parseFloat(p.latitud), parseFloat(p.longitud)])}
                                    color={esSeleccionada ? COLORES[i % COLORES.length] : '#bdbdbd'}
                                    weight={esSeleccionada ? 5 : 2}
                                    opacity={esSeleccionada ? 1 : 0.5}
                                />
                            );
                        })}

                        {/* Marcador inicio y fin de la ruta seleccionada */}
                        {rutaSeleccionada && rutaSeleccionada.puntos.length >= 2 && (() => {
                            const primer = rutaSeleccionada.puntos[0];
                            const ultimo = rutaSeleccionada.puntos[rutaSeleccionada.puntos.length - 1];
                            return (
                                <>
                                    <Marker
                                        position={[parseFloat(primer.latitud), parseFloat(primer.longitud)]}
                                        icon={iconoCamion}
                                    >
                                        <Popup>
                                            <strong>Inicio de ruta</strong><br />
                                            {rutaSeleccionada.nombre}<br />
                                            🕐 {rutaSeleccionada.horario?.slice(0, 5)} hrs
                                        </Popup>
                                    </Marker>
                                    <Marker
                                        position={[parseFloat(ultimo.latitud), parseFloat(ultimo.longitud)]}
                                        icon={iconoCamion}
                                    >
                                        <Popup>
                                            <strong>Fin de ruta</strong><br />
                                            {rutaSeleccionada.nombre}
                                        </Popup>
                                    </Marker>
                                </>
                            );
                        })()}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
