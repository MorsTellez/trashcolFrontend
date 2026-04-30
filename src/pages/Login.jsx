import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';

function Login() {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {
            const data = await login(correo, password);

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('nombre', data.usuario.nombre);
                localStorage.setItem('tipoUsuario', data.usuario.tipousuario || 'ciudadano');
                navigate('/dashboard');
            } else {
                setError(data.mensaje || 'Credenciales incorrectas.');
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
                <h2>TrashCol</h2>

                {error && (
                    <div className="alert-error">{error}</div>
                )}

                <form onSubmit={handleLogin}>
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
                    <button type="submit" disabled={cargando}>
                        {cargando ? 'Iniciando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <br />
                <p>
                    ¿No tienes cuenta?
                    <Link to="/registro"> Crear cuenta</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
