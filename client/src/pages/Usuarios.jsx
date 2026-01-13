import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaCheck, FaTimes, FaEdit, FaSync, FaBan, FaUserCheck } from 'react-icons/fa'
import { format } from 'date-fns'
import api from '../services/api'

function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsuarios()
  }, [])

  const loadUsuarios = async () => {
    try {
      const response = await api.get('/usuarios')
      setUsuarios(response.data)
    } catch (error) {
      toast.error('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  const handleAuthorize = async (id, autorizado) => {
    try {
      await api.patch(`/usuarios/${id}/authorize`, { autorizado })
      toast.success(autorizado ? 'Usuário autorizado!' : 'Autorização removida!')
      loadUsuarios()
    } catch (error) {
      toast.error('Erro ao atualizar autorização')
    }
  }

  const handleToggleActive = async (id, ativo) => {
    try {
      await api.patch(`/usuarios/${id}/toggle-active`, { ativo })
      toast.success(ativo ? 'Usuário ativado!' : 'Usuário desativado!')
      loadUsuarios()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao atualizar status')
    }
  }

  const handleResetUsage = async (id) => {
    if (!window.confirm('Deseja resetar os contadores de uso deste usuário?')) return

    try {
      await api.delete(`/usuarios/${id}/reset-usage`)
      toast.success('Contadores resetados com sucesso!')
      loadUsuarios()
    } catch (error) {
      toast.error('Erro ao resetar contadores')
    }
  }

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy')
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>
  }

  return (
    <div>
      <div className="page-header">
        <h2>Gerenciar Usuários</h2>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Autorizado</th>
              <th>Uso (Clientes/OS)</th>
              <th>Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td><strong>{usuario.nome}</strong></td>
                <td>{usuario.email}</td>
                <td>
                  <span className={`badge ${usuario.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>
                    {usuario.role}
                  </span>
                </td>
                <td>
                  <span className={`badge ${usuario.ativo ? 'badge-success' : 'badge-danger'}`}>
                    {usuario.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                  {usuario.role === 'admin' ? (
                    <span className="badge badge-success">Admin</span>
                  ) : usuario.autorizado ? (
                    <span className="badge badge-success">
                      <FaCheck /> Sim
                    </span>
                  ) : (
                    <span className="badge badge-warning">
                      <FaTimes /> Não
                    </span>
                  )}
                </td>
                <td>
                  {usuario.role === 'admin' ? (
                    <span className="badge badge-info">Ilimitado</span>
                  ) : (
                    <div>
                      <small>
                        {usuario.uso.clientes}/{usuario.limite_clientes} clientes<br />
                        {usuario.uso.os}/{usuario.limite_os} OS
                      </small>
                    </div>
                  )}
                </td>
                <td>{formatDate(usuario.created_at)}</td>
                <td>
                  {usuario.role !== 'admin' && (
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {!usuario.autorizado && (
                        <button
                          onClick={() => handleAuthorize(usuario.id, true)}
                          className="btn-icon btn-sm"
                          title="Autorizar acesso completo"
                          style={{ backgroundColor: 'var(--secondary)', color: 'white', padding: '5px 10px', borderRadius: '4px' }}
                        >
                          <FaCheck /> Autorizar
                        </button>
                      )}
                      {usuario.autorizado && (
                        <button
                          onClick={() => handleAuthorize(usuario.id, false)}
                          className="btn-icon btn-sm"
                          title="Remover autorização"
                          style={{ backgroundColor: 'var(--warning)', color: 'white', padding: '5px 10px', borderRadius: '4px' }}
                        >
                          <FaTimes /> Desautorizar
                        </button>
                      )}
                      <button
                        onClick={() => handleResetUsage(usuario.id)}
                        className="btn-icon btn-sm"
                        title="Resetar contadores"
                        style={{ backgroundColor: 'var(--gray)', color: 'white', padding: '5px 10px', borderRadius: '4px' }}
                      >
                        <FaSync />
                      </button>
                      {usuario.ativo ? (
                        <button
                          onClick={() => handleToggleActive(usuario.id, false)}
                          className="btn-icon btn-sm btn-danger"
                          title="Desativar usuário"
                          style={{ padding: '5px 10px', borderRadius: '4px' }}
                        >
                          <FaBan /> Desativar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleActive(usuario.id, true)}
                          className="btn-icon btn-sm"
                          title="Ativar usuário"
                          style={{ backgroundColor: 'var(--secondary)', color: 'white', padding: '5px 10px', borderRadius: '4px' }}
                        >
                          <FaUserCheck /> Ativar
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {usuarios.length === 0 && (
          <p className="empty-message">Nenhum usuário cadastrado</p>
        )}
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>📋 Legenda</h3>
        <p><strong>Autorizado:</strong> Usuário tem acesso completo sem limitações</p>
        <p><strong>Não Autorizado:</strong> Usuário tem limites de uso (5 clientes, 3 OS, etc)</p>
        <p><strong>Admin:</strong> Acesso total ao sistema, pode gerenciar outros usuários</p>
        <p><strong>Ativo/Inativo:</strong> Define se o usuário pode fazer login</p>
      </div>
    </div>
  )
}

export default Usuarios

