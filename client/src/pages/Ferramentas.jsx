import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaPlus, FaEdit, FaSearch, FaCheckCircle, FaTools } from 'react-icons/fa'
import TrashIcon from '../components/TrashIcon'
import api from '../services/api'

function Ferramentas() {
  const [ferramentas, setFerramentas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingFerramenta, setEditingFerramenta] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    descricao: '',
    quantidade: 1,
    estado: 'Boa',
    localizacao: '',
    data_aquisicao: '',
    valor: '',
    em_uso: false
  })

  useEffect(() => {
    loadFerramentas()
  }, [searchTerm])

  const loadFerramentas = async () => {
    try {
      const response = await api.get('/ferramentas', {
        params: { search: searchTerm }
      })
      setFerramentas(response.data)
    } catch (error) {
      toast.error('Erro ao carregar ferramentas')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingFerramenta) {
        await api.put(`/ferramentas/${editingFerramenta.id}`, formData)
        toast.success('Ferramenta atualizada com sucesso!')
      } else {
        await api.post('/ferramentas', formData)
        toast.success('Ferramenta criada com sucesso!')
      }
      resetForm()
      loadFerramentas()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao salvar ferramenta')
    }
  }

  const toggleUso = async (id) => {
    try {
      await api.patch(`/ferramentas/${id}/uso`)
      toast.success('Status atualizado!')
      loadFerramentas()
    } catch (error) {
      toast.error('Erro ao atualizar status')
    }
  }

  const handleEdit = (ferramenta) => {
    setEditingFerramenta(ferramenta)
    setFormData({
      ...ferramenta,
      em_uso: ferramenta.em_uso === 1
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir esta ferramenta?')) return
    
    try {
      await api.delete(`/ferramentas/${id}`)
      toast.success('Ferramenta excluída com sucesso!')
      loadFerramentas()
    } catch (error) {
      toast.error('Erro ao excluir ferramenta')
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      codigo: '',
      descricao: '',
      quantidade: 1,
      estado: 'Boa',
      localizacao: '',
      data_aquisicao: '',
      valor: '',
      em_uso: false
    })
    setEditingFerramenta(null)
    setShowModal(false)
  }

  const getEstadoBadge = (estado) => {
    const badges = {
      'Ótima': 'badge-success',
      'Boa': 'badge-info',
      'Regular': 'badge-warning',
      'Ruim': 'badge-danger',
      'Manutenção': 'badge-warning'
    }
    return badges[estado] || 'badge-info'
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>
  }

  return (
    <div>
      <div className="page-header">
        <h2>Ferramentas</h2>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <FaPlus /> Nova Ferramenta
        </button>
      </div>

      <div className="card">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar ferramentas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Código</th>
              <th>Quantidade</th>
              <th>Estado</th>
              <th>Localização</th>
              <th>Em Uso</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {ferramentas.map((ferramenta) => (
              <tr key={ferramenta.id}>
                <td>{ferramenta.nome}</td>
                <td>{ferramenta.codigo || '-'}</td>
                <td>{ferramenta.quantidade}</td>
                <td>
                  <span className={`badge ${getEstadoBadge(ferramenta.estado)}`}>
                    {ferramenta.estado}
                  </span>
                </td>
                <td>{ferramenta.localizacao || '-'}</td>
                <td>
                  <button
                    onClick={() => toggleUso(ferramenta.id)}
                    className={`badge ${ferramenta.em_uso ? 'badge-warning' : 'badge-success'}`}
                    style={{ cursor: 'pointer', border: 'none' }}
                    title={ferramenta.em_uso ? 'Clique para marcar como disponível' : 'Clique para marcar como em uso'}
                  >
                    {ferramenta.em_uso ? <><FaTools /> Em uso</> : <><FaCheckCircle /> Disponível</>}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleEdit(ferramenta)} className="btn-icon" title="Editar">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(ferramenta.id)} className="btn-icon btn-danger" title="Excluir">
                    <TrashIcon size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {ferramentas.length === 0 && (
          <p className="empty-message">Nenhuma ferramenta encontrada</p>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingFerramenta ? 'Editar Ferramenta' : 'Nova Ferramenta'}</h3>
              <button onClick={resetForm} className="close-btn">&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
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
                  <label>Código</label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows="2"
                />
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label>Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  >
                    <option value="Ótima">Ótima</option>
                    <option value="Boa">Boa</option>
                    <option value="Regular">Regular</option>
                    <option value="Ruim">Ruim</option>
                    <option value="Manutenção">Manutenção</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Localização</label>
                  <input
                    type="text"
                    value={formData.localizacao}
                    onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label>Data de Aquisição</label>
                  <input
                    type="date"
                    value={formData.data_aquisicao}
                    onChange={(e) => setFormData({ ...formData, data_aquisicao: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.em_uso}
                    onChange={(e) => setFormData({ ...formData, em_uso: e.target.checked })}
                  />
                  {' '}Em Uso
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

export default Ferramentas

