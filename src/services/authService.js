const API_URL = "http://localhost:3000/usuarios";

export const login = async (correo, password) => {

    try {

        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                correo,
                password
            })
        });

        const data = await response.json();

        return data;

    } catch (error) {
        console.error("Error login:", error);
        throw error;
    }

};


// ========================
// Registro usuario
// ========================

export const register = async (nombre, correo, password) => {

    try {

        const response = await fetch(`${API_URL}/registro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre,
                correo,
                password
            })
        });

        const data = await response.json();

        return data;

    } catch (error) {
        console.error("Error registro:", error);
        throw error;
    }

};