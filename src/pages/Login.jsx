import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";

function Login() {

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {

            const data = await login(correo, password);

            if (data.token) {

                localStorage.setItem("token", data.token);
                //Este dato lo manda al mapa para saber el nombre del usuario en el icono
                localStorage.setItem("nombre", data.usuario.nombre);

                navigate("/dashboard");

            } else {

                alert("Credenciales incorrectas");

            }

        } catch (error) {
            console.error(error);
            alert("Error al iniciar sesión");
        }

    };

    return (
        <div className="container">

            <div className="form-card">

                <h2>Login TrashCol</h2>

                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        placeholder="Correo"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                    />

                    <br /><br />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <br /><br />

                    <button type="submit">
                        Iniciar Sesión
                    </button>

                </form>

                <br />

                <p>
                    ¿No tienes cuenta?
                    <Link to="/registro"> Crear cuenta</Link>
                </p>

            </div>

        </div>
    )

}

export default Login;