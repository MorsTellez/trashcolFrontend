import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerUsuariosAdmin, cambiarTipoUsuario } from '../../services/api';

function AdminUsuarios() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const miId = parseInt(localStorage.getItem('idUsuario'));

    const cargar = () => {
        setCargando(true);
        obtenerUsuariosAdmin()
            .then(data => setUsuarios(Array.isArray(data) ? data : []))
            .finally(() => setCargando(false));
    };

    useEffect(() => { cargar(); }, []);

    const toggleTipo = async (usuario) => {
        const nuevoTipo = usuario.tipousuario === 'administrador' ? 'ciudadano' : 'administrador';
        await cambiarTipoUsuario(usuario.idusuario, nuevoTipo);
        cargar();
    };

    return (
        <div>
            <nav className="navbar trashcol-navbar px-4">
                <span className="navbar-brand text-white">TrashCol — Admin</span>
                <button className="btn btn-light btn-sm" onClick={() => navigate('/admin')}>Volver</button>
            </nav>

            <div className="dashboard-wrapper">
                <h3 className="text-center mt-4 mb-3">Usuarios registrados</h3>

                <div className="map-card">
                    {cargando && <p className="text-center text-muted">Cargando...</p>}

                    {!cargando && usuarios.length === 0 && (
                        <p className="text-center text-muted">No hay usuarios.</p>
                    )}

                    {usuarios.map((u) => (
                        <div key={u.idusuario} className="reporte-card d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{u.nombre}</strong>
                                <div style={{ fontSize: '13px', color: '#555' }}>{u.correo}</div>
                                <div style={{ fontSize: '12px', color: '#888' }}>
                                    Registrado: {new Date(u.fecharegistro).toLocaleDateString('es-MX')}
                                </div>
                                <span className={`badge mt-1 ${u.tipousuario === 'administrador' ? 'bg-primary' : 'bg-secondary'}`}>
                                    {u.tipousuario}
                                </span>
                            </div>
                            {u.idusuario !== miId && (
                                <button
                                    className={`btn btn-sm ${u.tipousuario === 'administrador' ? 'btn-outline-secondary' : 'btn-outline-primary'}`}
                                    onClick={() => toggleTipo(u)}
                                >
                                    {u.tipousuario === 'administrador' ? 'Quitar admin' : 'Hacer admin'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminUsuarios;