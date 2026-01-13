import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaPlus, FaEdit } from 'react-icons/fa'
import TrashIcon from '../components/TrashIcon'
import api from '../services/api'

function Servicos() {
  const [servicos, setServicos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingServico, setEditingServico] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    valor: '',
    tempo_estimado: '',
    categoria: '',
    ativo: true
  })

  useEffect(() => {
    loadServicos()
  }, [])

  const loadServicos = async () => {
    try {
      const response = await api.get('/servicos')
      setServicos(response.data)
    } catch (error) {
      toast.error('Erro ao carregar serviços')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingServico) {
        await api.put(`/servicos/${editingServico.id}`, formData)
        toast.success('Serviço atualizado com sucesso!')
      } else {
        await api.post('/servicos', formData)
        toast.success('Serviço criado com sucesso!')
      }
      resetForm()
      loadServicos()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao salvar serviço')
    }
  }

  const handleEdit = (servico) => {
    setEditingServico(servico)
    setFormData({
      ...servico,
      ativo: servico.ativo === 1
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este serviço?')) return
    
    try {
      await api.delete(`/servicos/${id}`)
      toast.success('Serviço excluído com sucesso!')
      loadServicos()
    } catch (error) {
      toast.error('Erro ao excluir serviço')
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      valor: '',
      tempo_estimado: '',
      categoria: '',
      ativo: true
    })
    setEditingServico(null)
    setShowModal(false)
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>
  }

  return (
    <div>
      <div className="page-header">
        <h2>Serviços</h2>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <FaPlus /> Novo Serviço
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Valor</th>
              <th>Tempo Estimado</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {servicos.map((servico) => (
              <tr key={servico.id}>
                <td>{servico.nome}</td>
                <td>{servico.categoria || '-'}</td>
                <td>R$ {parseFloat(servico.valor).toFixed(2)}</td>
                <td>{servico.tempo_estimado ? `${servico.tempo_estimado} min` : '-'}</td>
                <td>
                  <span className={`badge ${servico.ativo ? 'badge-success' : 'badge-danger'}`}>
                    {servico.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(servico)} className="btn-icon" title="Editar">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(servico.id)} className="btn-icon btn-danger" title="Excluir">
                    <TrashIcon size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {servicos.length === 0 && (
          <p className="empty-message">Nenhum serviço cadastrado</p>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingServico ? 'Editar Serviço' : 'Novo Serviço'}</h3>
              <button onClick={resetForm} className="close-btn">&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Nome *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label>Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Tempo Estimado (min)</label>
                  <input
                    type="number"
                    value={formData.tempo_estimado}
                    onChange={(e) => setFormData({ ...formData, tempo_estimado: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Categoria</label>
                <input
                  type="text"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.ativo}
                    onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  />
                  {' '}Ativo
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={resetForm} className="btn btn-outline">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Servicos

