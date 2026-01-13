import { useState, useEffect } from 'react'
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa'
import api from '../services/api'
import './LimitBanner.css'

function LimitBanner() {
  const [status, setStatus] = useState(null)
  const [show, setShow] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStatus()
  }, [])

  const loadStatus = async () => {
    try {
      const response = await api.get('/usuarios/me/usage')
      setStatus(response.data)
      // Se é autorizado ou admin, não mostra banner
      if (response.data.autorizado) {
        setShow(false)
      }
    } catch (error) {
      console.error('Erro ao carregar status:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !show || !status || status.autorizado) {
    return null
  }

  const getPercentage = (usado, limite) => {
    return Math.round((usado / limite) * 100)
  }

  const isNearLimit = (usado, limite) => {
    return usado >= limite * 0.8
  }

  return (
    <div className="limit-banner">
      <div className="limit-banner-content">
        <div className="limit-banner-icon">
          <FaExclamationTriangle />
        </div>
        <div className="limit-banner-info">
          <h4>Conta com Limitações</h4>
          <p>
            Você está usando uma conta de teste. 
            Entre em contato com o administrador para ter acesso completo ao sistema.
          </p>
          <div className="limit-stats">
            <div className="limit-item">
              <span className="limit-label">Clientes:</span>
              <span className={`limit-value ${isNearLimit(status.uso.clientes, status.limites.clientes) ? 'near-limit' : ''}`}>
                {status.uso.clientes}/{status.limites.clientes}
              </span>
              <div className="limit-bar">
                <div 
                  className="limit-progress" 
                  style={{ width: `${getPercentage(status.uso.clientes, status.limites.clientes)}%` }}
                />
              </div>
            </div>
            <div className="limit-item">
              <span className="limit-label">Ordens de Serviço:</span>
              <span className={`limit-value ${isNearLimit(status.uso.os, status.limites.os) ? 'near-limit' : ''}`}>
                {status.uso.os}/{status.limites.os}
              </span>
              <div className="limit-bar">
                <div 
                  className="limit-progress" 
                  style={{ width: `${getPercentage(status.uso.os, status.limites.os)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => setShow(false)} className="limit-banner-close">
          <FaTimes />
        </button>
      </div>
    </div>
  )
}

export default LimitBanner

