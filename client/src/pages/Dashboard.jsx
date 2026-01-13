import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaUsers, FaClipboardList, FaBox, FaExclamationTriangle } from 'react-icons/fa'
import api from '../services/api'
import './Dashboard.css'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [pecasBaixas, setPecasBaixas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [statsRes, pecasRes] = await Promise.all([
        api.get('/ordens-servico/estatisticas'),
        api.get('/pecas/estoque/baixo')
      ])
      setStats(statsRes.data)
      setPecasBaixas(pecasRes.data)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#3b82f6' }}>
            <FaClipboardList />
          </div>
          <div className="stat-content">
            <h3>Ordens Abertas</h3>
            <p className="stat-number">{stats?.abertas || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f59e0b' }}>
            <FaClipboardList />
          </div>
          <div className="stat-content">
            <h3>Em Andamento</h3>
            <p className="stat-number">{stats?.em_andamento || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#10b981' }}>
            <FaClipboardList />
          </div>
          <div className="stat-content">
            <h3>Concluídas</h3>
            <p className="stat-number">{stats?.concluidas || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#8b5cf6' }}>
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Total de OS</h3>
            <p className="stat-number">{stats?.total || 0}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="card">
          <div className="card-header">
            <h3><FaExclamationTriangle /> Peças com Estoque Baixo</h3>
            <Link to="/pecas" className="btn btn-primary btn-sm">Ver Todas</Link>
          </div>
          {pecasBaixas.length === 0 ? (
            <p className="empty-message">Nenhuma peça com estoque baixo</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Código</th>
                  <th>Quantidade</th>
                  <th>Mínimo</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pecasBaixas.slice(0, 5).map((peca) => (
                  <tr key={peca.id}>
                    <td>{peca.nome}</td>
                    <td>{peca.codigo}</td>
                    <td>{peca.quantidade}</td>
                    <td>{peca.quantidade_minima}</td>
                    <td>
                      <span className={peca.quantidade === 0 ? 'badge badge-danger' : 'badge badge-warning'}>
                        {peca.quantidade === 0 ? 'Sem estoque' : 'Estoque baixo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="quick-actions card">
          <h3>Ações Rápidas</h3>
          <div className="actions-grid">
            <Link to="/ordens-servico/nova" className="action-button">
              <FaClipboardList />
              <span>Nova Ordem de Serviço</span>
            </Link>
            <Link to="/clientes" className="action-button">
              <FaUsers />
              <span>Gerenciar Clientes</span>
            </Link>
            <Link to="/pecas" className="action-button">
              <FaBox />
              <span>Controle de Estoque</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

