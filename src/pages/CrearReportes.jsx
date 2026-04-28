import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function CrearReportes() {

    const navigate = useNavigate();

    const [posicion, setPosicion] = useState(null);

    // Detectar click en mapa
    function SeleccionarUbicacion() {

        useMapEvents({
            click(e) {
                setPosicion([
                    e.latlng.lat,
                    e.latlng.lng
                ]);
            }
        });

        return posicion ? <Marker position={posicion} /> : null;
    }

    return (

        <div>

            {/* Navbar */}

            <nav className="navbar trashcol-navbar px-4">

                <span className="navbar-brand text-white">
                    🌱 TrashCol
                </span>

                <button
                    className="btn btn-light btn-sm"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Volver
                </button>

            </nav>


            {/* Contenido */}

            <div className="dashboard-wrapper">

                <h3 className="text-center mt-4">
                    📍 Selecciona la ubicación del reporte
                </h3>

                <div className="map-card">

                    <MapContainer
                        center={[19.2456, -103.7245]}
                        zoom={14}
                        style={{ height: "450px", width: "100%" }}
                    >

                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <SeleccionarUbicacion />

                    </MapContainer>

                </div>
                <div className="map-card mt-3">

                    <h5>📝 Crear Reporte</h5>

                    <div className="mb-3">
                        <label>Descripción</label>
                        <textarea
                            className="form-control"
                            placeholder="Ej: No pasó el camión de basura..."
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label>Horario</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: 8:00 AM - 10:00 AM"
                        />
                    </div>

                    {posicion && (
                        <div className="alert alert-success">
                            📍 Ubicación seleccionada:
                            <br />
                            Lat: {posicion[0]}
                            <br />
                            Lng: {posicion[1]}
                        </div>
                    )}

                    <button className="btn btn-success">
                        Enviar Reporte
                    </button>

                </div>

            </div>

        </div>

    );

}

export default CrearReportes;