import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';

function Register() {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!nombre || !correo || !password || !confirmPassword) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setCargando(true);
        try {
            const data = await register(nombre, correo, password);

            if (data.usuario) {
                navigate('/');
            } else {
                setError(data.mensaje || 'Error creando cuenta.');
            }
        } catch (err) {
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container">
            <div className="form-card">
                <h2>Crear Cuenta</h2>

                {error && (
                    <div className="alert-error">{error}</div>
                )}

                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                    <br /><br />
                    <input
                        type="email"
                        placeholder="Correo"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                    <br /><br />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <br /><br />
                    <input
                        type="password"
                        placeholder="Confirmar Contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <br /><br />
                    <button type="submit" disabled={cargando}>
                        {cargando ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </button>
                </form>

                <br />
                <p>
                    ¿Ya tienes cuenta?
                    <Link to="/"> Iniciar sesión</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
