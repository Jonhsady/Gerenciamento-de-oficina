import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaPlus, FaEdit, FaSearch, FaFileExport } from 'react-icons/fa'
import TrashIcon from '../components/TrashIcon'
import api from '../services/api'

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCliente, setEditingCliente] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    nome: '',
    cpf_cnpj: '',
    telefone: '',
    email: '',
    endereco: '',
    observacoes: ''
  })

  useEffect(() => {
    loadClientes()
  }, [searchTerm])

  const loadClientes = async () => {
    try {
      const response = await api.get('/clientes', {
        params: { search: searchTerm }
      })
      setClientes(response.data.clientes)
    } catch (error) {
      toast.error('Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCliente) {
        await api.put(`/clientes/${editingCliente.id}`, formData)
        toast.success('Cliente atualizado com sucesso!')
      } else {
        await api.post('/clientes', formData)
        toast.success('Cliente criado com sucesso!')
      }
      resetForm()
      loadClientes()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao salvar cliente')
    }
  }

  const handleEdit = (cliente) => {
    setEditingCliente(cliente)
    setFormData(cliente)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este cliente?')) return
    
    try {
      await api.delete(`/clientes/${id}`)
      toast.success('Cliente excluído com sucesso!')
      loadClientes()
    } catch (error) {
      toast.error('Erro ao excluir cliente')
    }
  }

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/clientes/export/csv', {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Exportação realizada com sucesso!')
    } catch (error) {
      toast.error('Erro ao exportar clientes')
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      cpf_cnpj: '',
      telefone: '',
      email: '',
      endereco: '',
      observacoes: ''
    })
    setEditingCliente(null)
    setShowModal(false)
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>
  }

  return (
    <div>
      <div className="page-header">
        <h2>Clientes</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExportCSV} className="btn btn-secondary">
            <FaFileExport /> Exportar CSV
          </button>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <FaPlus /> Novo Cliente
          </button>
        </div>
      </div>

      <div className="card">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF/CNPJ</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td>{cliente.cpf_cnpj || '-'}</td>
                <td>{cliente.telefone || '-'}</td>
                <td>{cliente.email || '-'}</td>
                <td>
                  <button onClick={() => handleEdit(cliente)} className="btn-icon" title="Editar">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(cliente.id)} className="btn-icon btn-danger" title="Excluir">
                    <TrashIcon size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {clientes.length === 0 && (
          <p className="empty-message">Nenhum cliente encontrado</p>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingCliente ? 'Editar Cliente' : 'Novo Cliente'}</h3>
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

              <div className="form-row">
                <div className="input-group">
                  <label>CPF/CNPJ</label>
                  <input
                    type="text"
                    value={formData.cpf_cnpj}
                    onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label>Telefone</label>
                  <input
                    type="text"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
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

export default Clientes

