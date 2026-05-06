import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerCamionesAdmin, crearCamion, editarCamion, eliminarCamion } from '../../services/api';

function AdminCamiones() {
    const navigate = useNavigate();
    const [camiones, setCamiones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [editando, setEditando] = useState(null);
    const [form, setForm] = useState({ placa: '', chofer: '', estado: 'activo' });
    const [error, setError] = useState('');

    const cargar = () => {
        setCargando(true);
        obtenerCamionesAdmin()
            .then(data => setCamiones(Array.isArray(data) ? data : []))
            .finally(() => setCargando(false));
    };

    useEffect(() => { cargar(); }, []);

    const abrirEditar = (camion) => {
        setEditando(camion.idcamion);
        setForm({ placa: camion.placa, chofer: camion.chofer, estado: camion.estado });
        setMostrarForm(true);
    };

    const abrirNuevo = () => {
        setEditando(null);
        setForm({ placa: '', chofer: '', estado: 'activo' });
        setMostrarForm(true);
        setError('');
    };

    const handleGuardar = async () => {
        setError('');
        if (!form.placa || !form.chofer) {
            setError('Placa y chofer son obligatorios.');
            return;
        }

        if (editando) {
            await editarCamion(editando, form);
        } else {
            await crearCamion(form.placa, form.chofer);
        }
        setMostrarForm(false);
        cargar();
    };

    const handleEliminar = async (id) => {
        if (!confirm('¿Seguro que quieres eliminar este camión?')) return;
        await eliminarCamion(id);
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
                    <h3 className="mb-0">Camiones</h3>
                    <button className="btn btn-success btn-sm" onClick={abrirNuevo}>+ Nuevo camión</button>
                </div>

                {/* Formulario crear/editar */}
                {mostrarForm && (
                    <div className="map-card mb-3">
                        <h5>{editando ? 'Editar camión' : 'Nuevo camión'}</h5>
                        {error && <div className="alert-error">{error}</div>}
                        <div className="mb-2">
                            <label className="form-label">Placa</label>
                            <input className="form-control" value={form.placa}
                                onChange={e => setForm({ ...form, placa: e.target.value })} />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Chofer</label>
                            <input className="form-control" value={form.chofer}
                                onChange={e => setForm({ ...form, chofer: e.target.value })} />
                        </div>
                        {editando && (
                            <div className="mb-2">
                                <label className="form-label">Estado</label>
                                <select className="form-select" value={form.estado}
                                    onChange={e => setForm({ ...form, estado: e.target.value })}>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>
                        )}
                        <div className="d-flex gap-2 mt-3">
                            <button className="btn btn-success" onClick={handleGuardar}>Guardar</button>
                            <button className="btn btn-outline-secondary" onClick={() => setMostrarForm(false)}>Cancelar</button>
                        </div>
                    </div>
                )}

                <div className="map-card">
                    {cargando && <p className="text-center text-muted">Cargando...</p>}
                    {!cargando && camiones.length === 0 && (
                        <p className="text-center text-muted">No hay camiones registrados.</p>
                    )}
                    {camiones.map((c) => (
                        <div key={c.idcamion} className="reporte-card d-flex justify-content-between align-items-center">
                            <div>
                                <strong>🚛 {c.placa}</strong>
                                <div style={{ fontSize: '14px', color: '#555' }}>Chofer: {c.chofer}</div>
                                <span className={`badge ${c.estado === 'activo' ? 'bg-success' : 'bg-secondary'} mt-1`}>
                                    {c.estado}
                                </span>
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-sm btn-outline-primary" onClick={() => abrirEditar(c)}>Editar</button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(c.idcamion)}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminCamiones;