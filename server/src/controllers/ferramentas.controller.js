import db from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const getAll = (req, res, next) => {
  try {
    const { search, estado, em_uso } = req.query;

    let query = 'SELECT * FROM ferramentas WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (nome LIKE ? OR codigo LIKE ? OR descricao LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (estado) {
      query += ' AND estado = ?';
      params.push(estado);
    }

    if (em_uso !== undefined) {
      query += ' AND em_uso = ?';
      params.push(em_uso === 'true' ? 1 : 0);
    }

    query += ' ORDER BY nome ASC';

    const ferramentas = db.prepare(query).all(...params);
    res.json(ferramentas);
  } catch (error) {
    next(error);
  }
};

export const getById = (req, res, next) => {
  try {
    const ferramenta = db.prepare('SELECT * FROM ferramentas WHERE id = ?').get(req.params.id);
    
    if (!ferramenta) {
      throw new AppError('Ferramenta não encontrada', 404);
    }

    res.json(ferramenta);
  } catch (error) {
    next(error);
  }
};

export const create = (req, res, next) => {
  try {
    const { 
      nome, codigo, descricao, quantidade, estado, 
      localizacao, data_aquisicao, valor 
    } = req.body;

    const result = db.prepare(`
      INSERT INTO ferramentas (
        nome, codigo, descricao, quantidade, estado,
        localizacao, data_aquisicao, valor
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      nome, codigo, descricao, quantidade, estado,
      localizacao, data_aquisicao, valor
    );

    res.status(201).json({
      message: 'Ferramenta criada com sucesso',
      id: result.lastInsertRowid
    });
  } catch (error) {
    next(error);
  }
};

export const update = (req, res, next) => {
  try {
    const { 
      nome, codigo, descricao, quantidade, estado,
      localizacao, data_aquisicao, valor, em_uso 
    } = req.body;
    const { id } = req.params;

    const result = db.prepare(`
      UPDATE ferramentas 
      SET nome = ?, codigo = ?, descricao = ?, quantidade = ?, estado = ?,
          localizacao = ?, data_aquisicao = ?, valor = ?, em_uso = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      nome, codigo, descricao, quantidade, estado,
      localizacao, data_aquisicao, valor, em_uso ? 1 : 0, id
    );

    if (result.changes === 0) {
      throw new AppError('Ferramenta não encontrada', 404);
    }

    res.json({ message: 'Ferramenta atualizada com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const toggleUso = (req, res, next) => {
  try {
    const { id } = req.params;

    const ferramenta = db.prepare('SELECT em_uso FROM ferramentas WHERE id = ?').get(id);
    if (!ferramenta) {
      throw new AppError('Ferramenta não encontrada', 404);
    }

    const novoStatus = ferramenta.em_uso === 1 ? 0 : 1;
    db.prepare('UPDATE ferramentas SET em_uso = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(novoStatus, id);

    res.json({ 
      message: 'Status de uso atualizado',
      em_uso: novoStatus === 1 
    });
  } catch (error) {
    next(error);
  }
};

export const remove = (req, res, next) => {
  try {
    const { id } = req.params;

    const result = db.prepare('DELETE FROM ferramentas WHERE id = ?').run(id);

    if (result.changes === 0) {
      throw new AppError('Ferramenta não encontrada', 404);
    }

    res.json({ message: 'Ferramenta removida com sucesso' });
  } catch (error) {
    next(error);
  }
};

