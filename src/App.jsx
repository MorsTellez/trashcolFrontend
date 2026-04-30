import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import CrearReportes from './pages/CrearReportes';
import MisReportes from './pages/MisReportes';
import RutaProtegida from './components/RutaProtegida';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Login />} />
                <Route path="/registro" element={<Register />} />

                {/* Rutas protegidas — requieren token */}
                <Route path="/dashboard" element={
                    <RutaProtegida><Dashboard /></RutaProtegida>
                } />
                <Route path="/crear-reportes" element={
                    <RutaProtegida><CrearReportes /></RutaProtegida>
                } />
                <Route path="/mis-reportes" element={
                    <RutaProtegida><MisReportes /></RutaProtegida>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
