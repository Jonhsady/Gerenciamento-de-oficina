import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaPlus, FaEdit, FaSearch } from 'react-icons/fa'
import TrashIcon from '../components/TrashIcon'
import api from '../services/api'

function Contatos() {
  const [contatos, setContatos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingContato, setEditingContato] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'Fornecedor',
    empresa: '',
    telefone: '',
    email: '',
    endereco: '',
    observacoes: '',
    ativo: true
  })

  useEffect(() => {
    loadContatos()
  }, [searchTerm])

  const loadContatos = async () => {
    try {
      const response = await api.get('/contatos', {
        params: { search: searchTerm }
      })
      setContatos(response.data)
    } catch (error) {
      toast.error('Erro ao carregar contatos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingContato) {
        await api.put(`/contatos/${editingContato.id}`, formData)
        toast.success('Contato atualizado com sucesso!')
      } else {
        await api.post('/contatos', formData)
        toast.success('Contato criado com sucesso!')
      }
      resetForm()
      loadContatos()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao salvar contato')
    }
  }

  const handleEdit = (contato) => {
    setEditingContato(contato)
    setFormData({
      ...contato,
      ativo: contato.ativo === 1
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este contato?')) return
    
    try {
      await api.delete(`/contatos/${id}`)
      toast.success('Contato excluído com sucesso!')
      loadContatos()
    } catch (error) {
      toast.error('Erro ao excluir contato')
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      tipo: 'Fornecedor',
      empresa: '',
      telefone: '',
      email: '',
      endereco: '',
      observacoes: '',
      ativo: true
    })
    setEditingContato(null)
    setShowModal(false)
  }

  const getTipoBadge = (tipo) => {
    const badges = {
      'Fornecedor': 'badge-info',
      'Parceiro': 'badge-success',
      'Cliente': 'badge-warning',
      'Outro': 'badge-secondary'
    }
    return badges[tipo] || 'badge-info'
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>
  }

  return (
    <div>
      <div className="page-header">
        <h2>Contatos</h2>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <FaPlus /> Novo Contato
        </button>
      </div>

      <div className="card">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar contatos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Empresa</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {contatos.map((contato) => (
              <tr key={contato.id}>
                <td>{contato.nome}</td>
                <td>
                  <span className={`badge ${getTipoBadge(contato.tipo)}`}>
                    {contato.tipo}
                  </span>
                </td>
                <td>{contato.empresa || '-'}</td>
                <td>{contato.telefone || '-'}</td>
                <td>{contato.email || '-'}</td>
                <td>
                  <button onClick={() => handleEdit(contato)} className="btn-icon" title="Editar">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(contato.id)} className="btn-icon btn-danger" title="Excluir">
                    <TrashIcon size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {contatos.length === 0 && (
          <p className="empty-message">Nenhum contato encontrado</p>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingContato ? 'Editar Contato' : 'Novo Contato'}</h3>
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
                  <label>Tipo *</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    required
                  >
                    <option value="Fornecedor">Fornecedor</option>
                    <option value="Parceiro">Parceiro</option>
                    <option value="Cliente">Cliente</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label>Empresa</label>
                <input
                  type="text"
                  value={formData.empresa}
                  onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Telefone</label>
                  <input
                    type="text"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Endereço</label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>Observações</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows="3"
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

export default Contatos

