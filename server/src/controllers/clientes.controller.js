import db from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { incrementUsage } from '../middleware/checkLimits.js';

export const getAll = (req, res, next) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM clientes WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (nome LIKE ? OR cpf_cnpj LIKE ? OR telefone LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY nome ASC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const clientes = db.prepare(query).all(...params);
    
    const countQuery = search 
      ? 'SELECT COUNT(*) as total FROM clientes WHERE nome LIKE ? OR cpf_cnpj LIKE ? OR telefone LIKE ?'
      : 'SELECT COUNT(*) as total FROM clientes';
    const countParams = search ? [`%${search}%`, `%${search}%`, `%${search}%`] : [];
    const { total } = db.prepare(countQuery).get(...countParams);

    res.json({
      clientes,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getById = (req, res, next) => {
  try {
    const cliente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(req.params.id);
    
    if (!cliente) {
      throw new AppError('Cliente não encontrado', 404);
    }

    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

export const create = (req, res, next) => {
  try {
    const { nome, cpf_cnpj, telefone, email, endereco, observacoes } = req.body;

    const result = db.prepare(`
      INSERT INTO clientes (nome, cpf_cnpj, telefone, email, endereco, observacoes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(nome, cpf_cnpj, telefone, email, endereco, observacoes);

    // Incrementar contador de uso
    incrementUsage(req.user.id, 'clientes');

    res.status(201).json({
      message: 'Cliente criado com sucesso',
      id: result.lastInsertRowid
    });
  } catch (error) {
    next(error);
  }
};

export const update = (req, res, next) => {
  try {
    const { nome, cpf_cnpj, telefone, email, endereco, observacoes } = req.body;
    const { id } = req.params;

    const result = db.prepare(`
      UPDATE clientes 
      SET nome = ?, cpf_cnpj = ?, telefone = ?, email = ?, endereco = ?, observacoes = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(nome, cpf_cnpj, telefone, email, endereco, observacoes, id);

    if (result.changes === 0) {
      throw new AppError('Cliente não encontrado', 404);
    }

    res.json({ message: 'Cliente atualizado com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const remove = (req, res, next) => {
  try {
    const { id } = req.params;

    const result = db.prepare('DELETE FROM clientes WHERE id = ?').run(id);

    if (result.changes === 0) {
      throw new AppError('Cliente não encontrado', 404);
    }

    res.json({ message: 'Cliente removido com sucesso' });
  } catch (error) {
    next(error);
  }
};

