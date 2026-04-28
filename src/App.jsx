import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/register';
import CrearReportes from './pages/CrearReportes';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/registro' element={<Register />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/crear-reportes' element={<CrearReportes />} />
      

    </Routes>
    </BrowserRouter>
  )
}

export default App
