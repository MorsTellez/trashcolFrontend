import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';




function Dashboard() {
    
    const navigate = useNavigate();

    const [posicion, setPosicion] = useState([19.2456, -103.7245]);
    const [usuario, setUsuario] = useState("Usuario");

    useEffect(() => {

        navigator.geolocation.getCurrentPosition((position) => {

            const { latitude, longitude } = position.coords;
            setPosicion([latitude, longitude]);

        });

        // Obtener nombre usuario
        const nombre = localStorage.getItem("nombre");
        if (nombre) {
            setUsuario(nombre);
        }

    }, []);


    // Icono personalizado

    const iconoUsuario = new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        iconSize: [35, 35]
    });


    return (

        <div>

            {/* Navbar */}

            <nav className="navbar trashcol-navbar px-4">

                <span className="navbar-brand text-white">
                    🌱 TrashCol
                </span>

                <div className="d-flex align-items-center">

                    <span className="text-white me-3">
                        👤 {usuario}
                    </span>

                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/";
                        }}
                    >
                        Cerrar sesión
                    </button>

                </div>

            </nav>


            {/* Dashboard */}

            <div className="dashboard-wrapper">

                <h3 className="text-center mt-4 mb-3">
                    📍 Mapa de Colima
                </h3>
                 <div className="text-center mb-3">

                <button
                    className="btn btn-success"
                    onClick={() => navigate("/crear-reportes")}
                >
                    ➕ Crear Reporte
                </button>

            </div>

                <div className="map-card">

                    <MapContainer
                        center={posicion}
                        zoom={15}
                        style={{ height: "450px", width: "100%" }}
                    >

                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={posicion} icon={iconoUsuario}>
                            <Popup>
                                👤 {usuario} <br />
                                Tu ubicación actual
                            </Popup>
                        </Marker>

                    </MapContainer>

                </div>

            </div>

           


        </div>



    )

}

export default Dashboard;