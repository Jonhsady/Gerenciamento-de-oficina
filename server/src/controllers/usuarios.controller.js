import db from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

// Listar todos os usuários (apenas admin)
export const getAll = (req, res, next) => {
  try {
    const usuarios = db.prepare(`
      SELECT 
        id, nome, email, role, ativo, autorizado,
        limite_clientes, limite_servicos, limite_pecas, limite_os,
        created_at
      FROM usuarios
      ORDER BY created_at DESC
    `).all();

    // Buscar uso de cada usuário
    const usuariosComUso = usuarios.map(user => {
      const uso = db.prepare(`
        SELECT tipo, quantidade
        FROM uso_usuarios
        WHERE usuario_id = ?
      `).all(user.id);

      return {
        ...user,
        uso: {
          clientes: uso.find(u => u.tipo === 'clientes')?.quantidade || 0,
          servicos: uso.find(u => u.tipo === 'servicos')?.quantidade || 0,
          pecas: uso.find(u => u.tipo === 'pecas')?.quantidade || 0,
          os: uso.find(u => u.tipo === 'os')?.quantidade || 0
        }
      };
    });

    res.json(usuariosComUso);
  } catch (error) {
    next(error);
  }
};

// Autorizar usuário
export const authorize = (req, res, next) => {
  try {
    const { id } = req.params;
    const { autorizado } = req.body;

    const result = db.prepare(`
      UPDATE usuarios
      SET autorizado = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(autorizado ? 1 : 0, id);

    if (result.changes === 0) {
      throw new AppError('Usuário não encontrado', 404);
    }

    res.json({ 
      message: autorizado 
        ? 'Usuário autorizado com sucesso! Ele agora tem acesso completo.' 
        : 'Autorização removida. Usuário voltou aos limites padrão.'
    });
  } catch (error) {
    next(error);
  }
};

// Atualizar limites de um usuário
export const updateLimits = (req, res, next) => {
  try {
    const { id } = req.params;
    const { limite_clientes, limite_servicos, limite_pecas, limite_os } = req.body;

    const result = db.prepare(`
      UPDATE usuarios
      SET 
        limite_clientes = ?,
        limite_servicos = ?,
        limite_pecas = ?,
        limite_os = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(limite_clientes, limite_servicos, limite_pecas, limite_os, id);

    if (result.changes === 0) {
      throw new AppError('Usuário não encontrado', 404);
    }

    res.json({ message: 'Limites atualizados com sucesso!' });
  } catch (error) {
    next(error);
  }
};

// Desativar/ativar usuário
export const toggleActive = (req, res, next) => {
  try {
    const { id } = req.params;
    const { ativo } = req.body;

    // Não permitir desativar o próprio usuário
    if (parseInt(id) === req.user.id) {
      throw new AppError('Você não pode desativar sua própria conta', 400);
    }

    const result = db.prepare(`
      UPDATE usuarios
      SET ativo = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(ativo ? 1 : 0, id);

    if (result.changes === 0) {
      throw new AppError('Usuário não encontrado', 404);
    }

    res.json({ 
      message: ativo ? 'Usuário ativado com sucesso!' : 'Usuário desativado com sucesso!' 
    });
  } catch (error) {
    next(error);
  }
};

// Resetar contador de uso
export const resetUsage = (req, res, next) => {
  try {
    const { id } = req.params;

    db.prepare('DELETE FROM uso_usuarios WHERE usuario_id = ?').run(id);

    res.json({ message: 'Contadores de uso resetados com sucesso!' });
  } catch (error) {
    next(error);
  }
};

