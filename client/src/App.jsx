import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './pages/styles.css'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Usuarios from './pages/Usuarios'
import Clientes from './pages/Clientes'
import Servicos from './pages/Servicos'
import Pecas from './pages/Pecas'
import Ferramentas from './pages/Ferramentas'
import Contatos from './pages/Contatos'
import OrdensServico from './pages/OrdensServico'
import NovaOrdemServico from './pages/NovaOrdemServico'

function PrivateRoute({ children }) {
  const token = useAuthStore((state) => state.token)
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="servicos" element={<Servicos />} />
          <Route path="pecas" element={<Pecas />} />
          <Route path="ferramentas" element={<Ferramentas />} />
          <Route path="contatos" element={<Contatos />} />
          <Route path="ordens-servico" element={<OrdensServico />} />
          <Route path="ordens-servico/nova" element={<NovaOrdemServico />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
