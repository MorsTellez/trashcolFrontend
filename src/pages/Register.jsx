import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";

function Register() {

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validar campos vacíos
        if (!nombre || !correo || !password || !confirmPassword) {
            alert("Todos los campos son obligatorios");
            return;
        }

        // Validar contraseña
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {

            const data = await register(nombre, correo, password);

            alert("Cuenta creada correctamente");

            navigate("/");

        } catch (error) {
            console.error(error);
            alert("Error creando cuenta");
        }

    };

    return (
        <div className="container">

            <div className="form-card">

                <h2>Crear Cuenta</h2>

                <form onSubmit={handleRegister}>

                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />

                    <br /><br />

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

                    <input
                        type="password"
                        placeholder="Confirmar Contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <br /><br />

                    <button type="submit">
                        Crear Cuenta
                    </button>

                </form>

            </div>

        </div>
    )

}

export default Register;