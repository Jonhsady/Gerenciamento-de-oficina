import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaPlus, FaEye, FaEdit } from 'react-icons/fa'
import { format } from 'date-fns'
import api from '../services/api'

function OrdensServico() {
  const [ordens, setOrdens] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOS, setSelectedOS] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    loadOrdens()
  }, [filterStatus])

  const loadOrdens = async () => {
    try {
      const response = await api.get('/ordens-servico', {
        params: { status: filterStatus }
      })
      setOrdens(response.data)
    } catch (error) {
      toast.error('Erro ao carregar ordens de serviço')
    } finally {
      setLoading(false)
    }
  }

  const viewDetails = async (id) => {
    try {
      const response = await api.get(`/ordens-servico/${id}`)
      setSelectedOS(response.data)
      setShowDetailModal(true)
    } catch (error) {
      toast.error('Erro ao carregar detalhes')
    }
  }

  const updateStatus = async (id, novoStatus) => {
    try {
      await api.patch(`/ordens-servico/${id}/status`, { status: novoStatus })
      toast.success('Status atualizado!')
      loadOrdens()
      if (selectedOS && selectedOS.id === id) {
        setShowDetailModal(false)
      }
    } catch (error) {
      toast.error('Erro ao atualizar status')
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      'Aberta': 'badge-info',
      'Em Andamento': 'badge-warning',
      'Aguardando Peças': 'badge-warning',
      'Concluída': 'badge-success',
      'Cancelada': 'badge-danger'
    }
    return badges[status] || 'badge-info'
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return format(new Date(dateString), 'dd/MM/yyyy')
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>
  }

  return (
    <div>
      <div className="page-header">
        <h2>Ordens de Serviço</h2>
        <Link to="/ordens-servico/nova" className="btn btn-primary">
          <FaPlus /> Nova OS
        </Link>
      </div>

      <div className="card">
        <div className="filters">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos os Status</option>
            <option value="Aberta">Aberta</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Aguardando Peças">Aguardando Peças</option>
            <option value="Concluída">Concluída</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Número OS</th>
              <th>Cliente</th>
              <th>Veículo</th>
              <th>Data Abertura</th>
              <th>Status</th>
              <th>Valor Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {ordens.map((os) => (
              <tr key={os.id}>
                <td><strong>{os.numero_os}</strong></td>
                <td>{os.cliente_nome}</td>
                <td>{os.veiculo_modelo || '-'} {os.veiculo_placa ? `(${os.veiculo_placa})` : ''}</td>
                <td>{formatDate(os.data_abertura)}</td>
                <td>
                  <span className={`badge ${getStatusBadge(os.status)}`}>
                    {os.status}
                  </span>
                </td>
                <td>R$ {parseFloat(os.valor_total).toFixed(2)}</td>
                <td>
                  <button onClick={() => viewDetails(os.id)} className="btn-icon" title="Ver detalhes">
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {ordens.length === 0 && (
          <p className="empty-message">Nenhuma ordem de serviço encontrada</p>
        )}
      </div>

      {showDetailModal && selectedOS && (
        <div className="modal">
          <div className="modal-content modal-lg">
            <div className="modal-header">
              <h3>Ordem de Serviço - {selectedOS.numero_os}</h3>
              <button onClick={() => setShowDetailModal(false)} className="close-btn">&times;</button>
            </div>

            <div className="os-details">
              <div className="detail-section">
                <h4>Informações do Cliente</h4>
                <p><strong>Cliente:</strong> {selectedOS.cliente_nome}</p>
                <p><strong>Telefone:</strong> {selectedOS.cliente_telefone || '-'}</p>
              </div>

              <div className="detail-section">
                <h4>Informações do Veículo</h4>
                <p><strong>Modelo:</strong> {selectedOS.veiculo_modelo || '-'}</p>
                <p><strong>Placa:</strong> {selectedOS.veiculo_placa || '-'}</p>
                <p><strong>Ano:</strong> {selectedOS.veiculo_ano || '-'}</p>
              </div>

              <div className="detail-section">
                <h4>Status e Datas</h4>
                <p><strong>Status:</strong> <span className={`badge ${getStatusBadge(selectedOS.status)}`}>{selectedOS.status}</span></p>
                <p><strong>Data Abertura:</strong> {formatDate(selectedOS.data_abertura)}</p>
                <p><strong>Data Prevista:</strong> {formatDate(selectedOS.data_prevista)}</p>
                <p><strong>Data Conclusão:</strong> {formatDate(selectedOS.data_conclusao)}</p>
              </div>

              {selectedOS.servicos && selectedOS.servicos.length > 0 && (
                <div className="detail-section">
                  <h4>Serviços</h4>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Serviço</th>
                        <th>Quantidade</th>
                        <th>Valor Unit.</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOS.servicos.map((item) => (
                        <tr key={item.id}>
                          <td>{item.servico_nome}</td>
                          <td>{item.quantidade}</td>
                          <td>R$ {parseFloat(item.valor_unitario).toFixed(2)}</td>
                          <td>R$ {parseFloat(item.valor_total).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {selectedOS.pecas && selectedOS.pecas.length > 0 && (
                <div className="detail-section">
                  <h4>Peças</h4>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Peça</th>
                        <th>Quantidade</th>
                        <th>Valor Unit.</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOS.pecas.map((item) => (
                        <tr key={item.id}>
                          <td>{item.peca_nome}</td>
                          <td>{item.quantidade}</td>
                          <td>R$ {parseFloat(item.valor_unitario).toFixed(2)}</td>
                          <td>R$ {parseFloat(item.valor_total).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="detail-section">
                <h4>Valor Total</h4>
                <p style={{ fontSize: '24px', color: 'var(--primary)', fontWeight: 'bold' }}>
                  R$ {parseFloat(selectedOS.valor_total).toFixed(2)}
                </p>
              </div>

              {selectedOS.observacoes && (
                <div className="detail-section">
                  <h4>Observações</h4>
                  <p>{selectedOS.observacoes}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => setShowDetailModal(false)} className="btn btn-outline">
                Fechar
              </button>
              {selectedOS.status !== 'Concluída' && selectedOS.status !== 'Cancelada' && (
                <>
                  {selectedOS.status === 'Aberta' && (
                    <button onClick={() => updateStatus(selectedOS.id, 'Em Andamento')} className="btn btn-warning">
                      Iniciar Atendimento
                    </button>
                  )}
                  {selectedOS.status === 'Em Andamento' && (
                    <button onClick={() => updateStatus(selectedOS.id, 'Concluída')} className="btn btn-success">
                      Concluir OS
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdensServico

