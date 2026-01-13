import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaPlus, FaEdit, FaSearch, FaArrowUp, FaArrowDown, FaFileExport } from 'react-icons/fa'
import TrashIcon from '../components/TrashIcon'
import api from '../services/api'

function Pecas() {
  const [pecas, setPecas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showQuantidadeModal, setShowQuantidadeModal] = useState(false)
  const [editingPeca, setEditingPeca] = useState(null)
  const [selectedPeca, setSelectedPeca] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    descricao: '',
    quantidade: 0,
    quantidade_minima: 0,
    valor_unitario: '',
    localizacao: '',
    fornecedor: '',
    categoria: '',
    ativo: true
  })
  const [quantidadeData, setQuantidadeData] = useState({
    quantidade: '',
    operacao: 'adicionar'
  })

  useEffect(() => {
    loadPecas()
  }, [searchTerm])

  const loadPecas = async () => {
    try {
      const response = await api.get('/pecas', {
        params: { search: searchTerm }
      })
      setPecas(response.data)
    } catch (error) {
      toast.error('Erro ao carregar peças')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingPeca) {
        await api.put(`/pecas/${editingPeca.id}`, formData)
        toast.success('Peça atualizada com sucesso!')
      } else {
        await api.post('/pecas', formData)
        toast.success('Peça criada com sucesso!')
      }
      resetForm()
      loadPecas()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao salvar peça')
    }
  }

  const handleQuantidadeSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.patch(`/pecas/${selectedPeca.id}/quantidade`, {
        quantidade: parseInt(quantidadeData.quantidade),
        operacao: quantidadeData.operacao
      })
      toast.success('Quantidade atualizada com sucesso!')
      setShowQuantidadeModal(false)
      setQuantidadeData({ quantidade: '', operacao: 'adicionar' })
      loadPecas()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao atualizar quantidade')
    }
  }

  const handleEdit = (peca) => {
    setEditingPeca(peca)
    setFormData({
      ...peca,
      ativo: peca.ativo === 1
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir esta peça?')) return
    
    try {
      await api.delete(`/pecas/${id}`)
      toast.success('Peça excluída com sucesso!')
      loadPecas()
    } catch (error) {
      toast.error('Erro ao excluir peça')
    }
  }

  const openQuantidadeModal = (peca) => {
    setSelectedPeca(peca)
    setShowQuantidadeModal(true)
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      codigo: '',
      descricao: '',
      quantidade: 0,
      quantidade_minima: 0,
      valor_unitario: '',
      localizacao: '',
      fornecedor: '',
      categoria: '',
      ativo: true
    })
    setEditingPeca(null)
    setShowModal(false)
  }

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/pecas/export/csv', {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `pecas_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Exportação realizada com sucesso!')
    } catch (error) {
      toast.error('Erro ao exportar peças')
    }
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>
  }

  return (
    <div>
      <div className="page-header">
        <h2>Peças</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExportCSV} className="btn btn-secondary">
            <FaFileExport /> Exportar CSV
          </button>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <FaPlus /> Nova Peça
          </button>
        </div>
      </div>

      <div className="card">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar peças..."
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
              <th>Mínimo</th>
              <th>Valor Unit.</th>
              <th>Localização</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pecas.map((peca) => (
              <tr key={peca.id} className={peca.quantidade <= peca.quantidade_minima ? 'row-warning' : ''}>
                <td>{peca.nome}</td>
                <td>{peca.codigo || '-'}</td>
                <td>
                  {peca.quantidade}
                  <button onClick={() => openQuantidadeModal(peca)} className="btn-icon btn-sm ml-2" title="Editar quantidade">
                    <FaEdit />
                  </button>
                </td>
                <td>{peca.quantidade_minima}</td>
                <td>R$ {parseFloat(peca.valor_unitario).toFixed(2)}</td>
                <td>{peca.localizacao || '-'}</td>
                <td>
                  {peca.quantidade === 0 ? (
                    <span className="badge badge-danger">Sem estoque</span>
                  ) : peca.quantidade <= peca.quantidade_minima ? (
                    <span className="badge badge-warning">Estoque baixo</span>
                  ) : (
                    <span className="badge badge-success">Ok</span>
                  )}
                </td>
                <td>
                  <button onClick={() => handleEdit(peca)} className="btn-icon" title="Editar">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(peca.id)} className="btn-icon btn-danger" title="Excluir">
                    <TrashIcon size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pecas.length === 0 && (
          <p className="empty-message">Nenhuma peça encontrada</p>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingPeca ? 'Editar Peça' : 'Nova Peça'}</h3>
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
                  <label>Quantidade *</label>
                  <input
                    type="number"
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Quantidade Mínima *</label>
                  <input
                    type="number"
                    value={formData.quantidade_minima}
                    onChange={(e) => setFormData({ ...formData, quantidade_minima: e.target.value })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Valor Unitário (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.valor_unitario}
                    onChange={(e) => setFormData({ ...formData, valor_unitario: e.target.value })}
                    required
                  />
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
                  <label>Fornecedor</label>
                  <input
                    type="text"
                    value={formData.fornecedor}
                    onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
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

      {showQuantidadeModal && (
        <div className="modal">
          <div className="modal-content modal-sm">
            <div className="modal-header">
              <h3>Atualizar Quantidade</h3>
              <button onClick={() => setShowQuantidadeModal(false)} className="close-btn">&times;</button>
            </div>

            <form onSubmit={handleQuantidadeSubmit}>
              <p><strong>{selectedPeca?.nome}</strong></p>
              <p>Quantidade atual: {selectedPeca?.quantidade}</p>

              <div className="input-group">
                <label>Operação</label>
                <select
                  value={quantidadeData.operacao}
                  onChange={(e) => setQuantidadeData({ ...quantidadeData, operacao: e.target.value })}
                >
                  <option value="adicionar">Adicionar ao estoque</option>
                  <option value="remover">Remover do estoque</option>
                </select>
              </div>

              <div className="input-group">
                <label>Quantidade</label>
                <input
                  type="number"
                  min="1"
                  value={quantidadeData.quantidade}
                  onChange={(e) => setQuantidadeData({ ...quantidadeData, quantidade: e.target.value })}
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowQuantidadeModal(false)} className="btn btn-outline">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Atualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pecas

