import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Páginas públicas
import Login from './pages/Login';
import Register from './pages/Register';

// Páginas ciudadano
import Dashboard from './pages/Dashboard';
import CrearReportes from './pages/CrearReportes';
import MisReportes from './pages/MisReportes';

// Páginas admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReportes from './pages/admin/AdminReportes';
import AdminCamiones from './pages/admin/AdminCamiones';
import AdminUsuarios from './pages/admin/AdminUsuarios';

// Protección de rutas
import RutaProtegida from './components/RutaProtegida';
import RutaAdmin from './components/RutaAdmin';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Login />} />
                <Route path="/registro" element={<Register />} />

                {/* Rutas ciudadano */}
                <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
                <Route path="/crear-reportes" element={<RutaProtegida><CrearReportes /></RutaProtegida>} />
                <Route path="/mis-reportes" element={<RutaProtegida><MisReportes /></RutaProtegida>} />

                {/* Rutas admin — requieren token + ser administrador */}
                <Route path="/admin" element={<RutaAdmin><AdminDashboard /></RutaAdmin>} />
                <Route path="/admin/reportes" element={<RutaAdmin><AdminReportes /></RutaAdmin>} />
                <Route path="/admin/camiones" element={<RutaAdmin><AdminCamiones /></RutaAdmin>} />
                <Route path="/admin/usuarios" element={<RutaAdmin><AdminUsuarios /></RutaAdmin>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
