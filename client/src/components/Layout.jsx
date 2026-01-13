import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { FaHome, FaUsers, FaTools, FaBox, FaWrench, FaAddressBook, FaClipboardList, FaSignOutAlt, FaUsersCog } from 'react-icons/fa'
import LimitBanner from './LimitBanner'
import './Layout.css'

function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <FaHome /> },
    { path: '/clientes', label: 'Clientes', icon: <FaUsers /> },
    { path: '/servicos', label: 'Serviços', icon: <FaTools /> },
    { path: '/pecas', label: 'Peças', icon: <FaBox /> },
    { path: '/ferramentas', label: 'Ferramentas', icon: <FaWrench /> },
    { path: '/contatos', label: 'Contatos', icon: <FaAddressBook /> },
    { path: '/ordens-servico', label: 'Ordens de Serviço', icon: <FaClipboardList /> },
  ]

  // Adicionar gerenciamento de usuários se for admin
  if (user?.role === 'admin') {
    menuItems.push({ path: '/usuarios', label: 'Gerenciar Usuários', icon: <FaUsersCog /> })
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>🚗 Oficina</h2>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="main-content">
        <header className="header">
          <div className="header-content">
            <h1>Sistema de Gerenciamento de Oficina</h1>
            <div className="user-menu">
              <span>Olá, {user?.nome}</span>
              <button onClick={handleLogout} className="btn btn-outline">
                <FaSignOutAlt /> Sair
              </button>
            </div>
          </div>
        </header>

        <LimitBanner />

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout

