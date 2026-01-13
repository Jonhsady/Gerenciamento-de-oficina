import db from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const getAll = (req, res, next) => {
  try {
    const { search, tipo, ativo } = req.query;

    let query = 'SELECT * FROM contatos WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (nome LIKE ? OR empresa LIKE ? OR telefone LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (tipo) {
      query += ' AND tipo = ?';
      params.push(tipo);
    }

    if (ativo !== undefined) {
      query += ' AND ativo = ?';
      params.push(ativo === 'true' ? 1 : 0);
    }

    query += ' ORDER BY nome ASC';

    const contatos = db.prepare(query).all(...params);
    res.json(contatos);
  } catch (error) {
    next(error);
  }
};

export const getById = (req, res, next) => {
  try {
    const contato = db.prepare('SELECT * FROM contatos WHERE id = ?').get(req.params.id);
    
    if (!contato) {
      throw new AppError('Contato não encontrado', 404);
    }

    res.json(contato);
  } catch (error) {
    next(error);
  }
};

export const create = (req, res, next) => {
  try {
    const { nome, tipo, empresa, telefone, email, endereco, observacoes } = req.body;

    const result = db.prepare(`
      INSERT INTO contatos (nome, tipo, empresa, telefone, email, endereco, observacoes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(nome, tipo, empresa, telefone, email, endereco, observacoes);

    res.status(201).json({
      message: 'Contato criado com sucesso',
      id: result.lastInsertRowid
    });
  } catch (error) {
    next(error);
  }
};

export const update = (req, res, next) => {
  try {
    const { nome, tipo, empresa, telefone, email, endereco, observacoes, ativo } = req.body;
    const { id } = req.params;

    const result = db.prepare(`
      UPDATE contatos 
      SET nome = ?, tipo = ?, empresa = ?, telefone = ?, email = ?, 
          endereco = ?, observacoes = ?, ativo = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(nome, tipo, empresa, telefone, email, endereco, observacoes, ativo ? 1 : 0, id);

    if (result.changes === 0) {
      throw new AppError('Contato não encontrado', 404);
    }

    res.json({ message: 'Contato atualizado com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const remove = (req, res, next) => {
  try {
    const { id } = req.params;

    const result = db.prepare('DELETE FROM contatos WHERE id = ?').run(id);

    if (result.changes === 0) {
      throw new AppError('Contato não encontrado', 404);
    }

    res.json({ message: 'Contato removido com sucesso' });
  } catch (error) {
    next(error);
  }
};

