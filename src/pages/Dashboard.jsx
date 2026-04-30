import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { cerrarSesion, getUsuario } from '../services/authService';

function Dashboard() {
    const navigate = useNavigate();
    const [posicion, setPosicion] = useState([19.2456, -103.7245]);
    const { nombre } = getUsuario();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => setPosicion([pos.coords.latitude, pos.coords.longitude]),
            () => {} // Si niega permisos, usa coordenadas por defecto
        );
    }, []);

    const iconoUsuario = new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        iconSize: [35, 35]
    });

    return (
        <div>
            <nav className="navbar trashcol-navbar px-4">
                <span className="navbar-brand text-white">TrashCol</span>
                <div className="d-flex align-items-center gap-3">
                    <span className="text-white">
                        {nombre || 'Usuario'}
                    </span>
                    <button
                        className="btn btn-outline-light btn-sm"
                        onClick={() => navigate('/mis-reportes')}
                    >
                        Mis reportes
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={cerrarSesion}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </nav>

            <div className="dashboard-wrapper">
                <h3 className="text-center mt-4 mb-3">Mapa de Colima</h3>

                <div className="text-center mb-3">
                    <button
                        className="btn btn-success"
                        onClick={() => navigate('/crear-reportes')}
                    >
                        Crear Reporte
                    </button>
                </div>

                <div className="map-card">
                    <MapContainer
                        center={posicion}
                        zoom={15}
                        style={{ height: '450px', width: '100%' }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={posicion} icon={iconoUsuario}>
                            <Popup>
                                {nombre || 'Tú'} — Tu ubicación actual
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
