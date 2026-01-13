import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaPlus } from 'react-icons/fa'
import TrashIcon from '../components/TrashIcon'
import api from '../services/api'

function NovaOrdemServico() {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [servicos, setServicos] = useState([])
  const [pecas, setPecas] = useState([])
  const [formData, setFormData] = useState({
    cliente_id: '',
    veiculo_placa: '',
    veiculo_modelo: '',
    veiculo_ano: '',
    data_prevista: '',
    observacoes: ''
  })
  const [servicosSelecionados, setServicosSelecionados] = useState([])
  const [pecasSelecionadas, setPecasSelecionadas] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [clientesRes, servicosRes, pecasRes] = await Promise.all([
        api.get('/clientes'),
        api.get('/servicos', { params: { ativo: 'true' } }),
        api.get('/pecas', { params: { ativo: 'true' } })
      ])
      setClientes(clientesRes.data.clientes)
      setServicos(servicosRes.data)
      setPecas(pecasRes.data)
    } catch (error) {
      toast.error('Erro ao carregar dados')
    }
  }

  const adicionarServico = () => {
    setServicosSelecionados([...servicosSelecionados, {
      servico_id: '',
      quantidade: 1,
      valor_unitario: 0
    }])
  }

  const removerServico = (index) => {
    setServicosSelecionados(servicosSelecionados.filter((_, i) => i !== index))
  }

  const atualizarServico = (index, field, value) => {
    const novosServicos = [...servicosSelecionados]
    novosServicos[index][field] = value
    
    if (field === 'servico_id') {
      const servico = servicos.find(s => s.id === parseInt(value))
      if (servico) {
        novosServicos[index].valor_unitario = servico.valor
      }
    }
    
    setServicosSelecionados(novosServicos)
  }

  const adicionarPeca = () => {
    setPecasSelecionadas([...pecasSelecionadas, {
      peca_id: '',
      quantidade: 1,
      valor_unitario: 0
    }])
  }

  const removerPeca = (index) => {
    setPecasSelecionadas(pecasSelecionadas.filter((_, i) => i !== index))
  }

  const atualizarPeca = (index, field, value) => {
    const novasPecas = [...pecasSelecionadas]
    novasPecas[index][field] = value
    
    if (field === 'peca_id') {
      const peca = pecas.find(p => p.id === parseInt(value))
      if (peca) {
        novasPecas[index].valor_unitario = peca.valor_unitario
      }
    }
    
    setPecasSelecionadas(novasPecas)
  }

  const calcularTotal = () => {
    let total = 0
    servicosSelecionados.forEach(s => {
      total += s.quantidade * s.valor_unitario
    })
    pecasSelecionadas.forEach(p => {
      total += p.quantidade * p.valor_unitario
    })
    return total
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.cliente_id) {
      toast.error('Selecione um cliente')
      return
    }

    if (servicosSelecionados.length === 0 && pecasSelecionadas.length === 0) {
      toast.error('Adicione pelo menos um serviço ou peça')
      return
    }

    try {
      await api.post('/ordens-servico', {
        ...formData,
        servicos: servicosSelecionados,
        pecas: pecasSelecionadas
      })
      toast.success('Ordem de serviço criada com sucesso!')
      navigate('/ordens-servico')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao criar ordem de serviço')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Nova Ordem de Serviço</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <h3>Informações do Cliente</h3>
          <div className="form-row">
            <div className="input-group">
              <label>Cliente *</label>
              <select
                value={formData.cliente_id}
                onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                required
              >
                <option value="">Selecione um cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Informações do Veículo</h3>
          <div className="form-row">
            <div className="input-group">
              <label>Placa</label>
              <input
                type="text"
                value={formData.veiculo_placa}
                onChange={(e) => setFormData({ ...formData, veiculo_placa: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Modelo</label>
              <input
                type="text"
                value={formData.veiculo_modelo}
                onChange={(e) => setFormData({ ...formData, veiculo_modelo: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Ano</label>
              <input
                type="text"
                value={formData.veiculo_ano}
                onChange={(e) => setFormData({ ...formData, veiculo_ano: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Serviços</h3>
            <button type="button" onClick={adicionarServico} className="btn btn-secondary btn-sm">
              <FaPlus /> Adicionar Serviço
            </button>
          </div>

          {servicosSelecionados.map((servico, index) => (
            <div key={index} className="item-row">
              <div className="form-row">
                <div className="input-group" style={{ flex: 2 }}>
                  <label>Serviço</label>
                  <select
                    value={servico.servico_id}
                    onChange={(e) => atualizarServico(index, 'servico_id', e.target.value)}
                    required
                  >
                    <option value="">Selecione</option>
                    {servicos.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nome} - R$ {parseFloat(s.valor).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    value={servico.quantidade}
                    onChange={(e) => atualizarServico(index, 'quantidade', e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Valor Unit.</label>
                  <input
                    type="number"
                    step="0.01"
                    value={servico.valor_unitario}
                    onChange={(e) => atualizarServico(index, 'valor_unitario', e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Total</label>
                  <input
                    type="text"
                    value={`R$ ${(servico.quantidade * servico.valor_unitario).toFixed(2)}`}
                    disabled
                  />
                </div>

                <button type="button" onClick={() => removerServico(index)} className="btn-icon btn-danger" title="Remover">
                  <TrashIcon size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Peças</h3>
            <button type="button" onClick={adicionarPeca} className="btn btn-secondary btn-sm">
              <FaPlus /> Adicionar Peça
            </button>
          </div>

          {pecasSelecionadas.map((peca, index) => (
            <div key={index} className="item-row">
              <div className="form-row">
                <div className="input-group" style={{ flex: 2 }}>
                  <label>Peça</label>
                  <select
                    value={peca.peca_id}
                    onChange={(e) => atualizarPeca(index, 'peca_id', e.target.value)}
                    required
                  >
                    <option value="">Selecione</option>
                    {pecas.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome} - Estoque: {p.quantidade} - R$ {parseFloat(p.valor_unitario).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    value={peca.quantidade}
                    onChange={(e) => atualizarPeca(index, 'quantidade', e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Valor Unit.</label>
                  <input
                    type="number"
                    step="0.01"
                    value={peca.valor_unitario}
                    onChange={(e) => atualizarPeca(index, 'valor_unitario', e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Total</label>
                  <input
                    type="text"
                    value={`R$ ${(peca.quantidade * peca.valor_unitario).toFixed(2)}`}
                    disabled
                  />
                </div>

                <button type="button" onClick={() => removerPeca(index)} className="btn-icon btn-danger" title="Remover">
                  <TrashIcon size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>Informações Adicionais</h3>
          <div className="input-group">
            <label>Data Prevista</label>
            <input
              type="date"
              value={formData.data_prevista}
              onChange={(e) => setFormData({ ...formData, data_prevista: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label>Observações</label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              rows="4"
            />
          </div>

          <div className="total-section">
            <h3>Valor Total: <span style={{ color: 'var(--primary)' }}>R$ {calcularTotal().toFixed(2)}</span></h3>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/ordens-servico')} className="btn btn-outline">
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Criar Ordem de Serviço
          </button>
        </div>
      </form>
    </div>
  )
}

export default NovaOrdemServico

