import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearReporte } from '../services/api';

function SeleccionarUbicacion({ setPosicion }) {
    useMapEvents({
        click(e) {
            setPosicion([e.latlng.lat, e.latlng.lng]);
        }
    });
    return null;
}

function CrearReportes() {
    const navigate = useNavigate();
    const [posicion, setPosicion] = useState(null);
    const [descripcion, setDescripcion] = useState('');
    const [foto, setFoto] = useState(null);
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    const handleEnviar = async () => {
        setError('');

        if (!descripcion.trim()) {
            setError('La descripción es obligatoria.');
            return;
        }
        if (!posicion) {
            setError('Selecciona una ubicación en el mapa.');
            return;
        }

        setEnviando(true);
        try {
            const data = await crearReporte(
                descripcion,
                posicion[0],
                posicion[1],
                foto
            );

            if (data.idreporte) {
                navigate('/mis-reportes');
            } else {
                setError(data.mensaje || 'Error al enviar el reporte.');
            }
        } catch (err) {
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setEnviando(false);
        }
    };

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
                <h3 className="text-center mt-4">Selecciona la ubicación del reporte</h3>
                <p className="text-center text-muted" style={{ fontSize: '14px' }}>
                    Haz clic en el mapa para marcar el lugar del problema
                </p>

                <div className="map-card">
                    <MapContainer
                        center={[19.2456, -103.7245]}
                        zoom={14}
                        style={{ height: '350px', width: '100%' }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <SeleccionarUbicacion setPosicion={setPosicion} />
                        {posicion && <Marker position={posicion} />}
                    </MapContainer>
                </div>

                <div className="map-card mt-3">
                    <h5>Crear Reporte</h5>

                    {error && (
                        <div className="alert alert-danger py-2">{error}</div>
                    )}

                    {posicion && (
                        <div className="alert alert-success py-2">
                            Ubicación seleccionada — Lat: {posicion[0].toFixed(5)}, Lng: {posicion[1].toFixed(5)}
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label">Descripción *</label>
                        <textarea
                            className="form-control"
                            placeholder="Ej: No pasó el camión de basura el día de hoy..."
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Foto (opcional)</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) => setFoto(e.target.files[0])}
                        />
                    </div>

                    <button
                        className="btn btn-success w-100"
                        onClick={handleEnviar}
                        disabled={enviando}
                    >
                        {enviando ? 'Enviando...' : 'Enviar Reporte'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CrearReportes;
