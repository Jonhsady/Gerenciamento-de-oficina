import db from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const getAll = (req, res, next) => {
  try {
    const { search, categoria, ativo } = req.query;

    let query = 'SELECT * FROM servicos WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (nome LIKE ? OR descricao LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (categoria) {
      query += ' AND categoria = ?';
      params.push(categoria);
    }

    if (ativo !== undefined) {
      query += ' AND ativo = ?';
      params.push(ativo === 'true' ? 1 : 0);
    }

    query += ' ORDER BY nome ASC';

    const servicos = db.prepare(query).all(...params);
    res.json(servicos);
  } catch (error) {
    next(error);
  }
};

export const getById = (req, res, next) => {
  try {
    const servico = db.prepare('SELECT * FROM servicos WHERE id = ?').get(req.params.id);
    
    if (!servico) {
      throw new AppError('Serviço não encontrado', 404);
    }

    res.json(servico);
  } catch (error) {
    next(error);
  }
};

export const create = (req, res, next) => {
  try {
    const { nome, descricao, valor, tempo_estimado, categoria } = req.body;

    const result = db.prepare(`
      INSERT INTO servicos (nome, descricao, valor, tempo_estimado, categoria)
      VALUES (?, ?, ?, ?, ?)
    `).run(nome, descricao, valor, tempo_estimado, categoria);

    res.status(201).json({
      message: 'Serviço criado com sucesso',
      id: result.lastInsertRowid
    });
  } catch (error) {
    next(error);
  }
};

export const update = (req, res, next) => {
  try {
    const { nome, descricao, valor, tempo_estimado, categoria, ativo } = req.body;
    const { id } = req.params;

    const result = db.prepare(`
      UPDATE servicos 
      SET nome = ?, descricao = ?, valor = ?, tempo_estimado = ?, categoria = ?, ativo = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(nome, descricao, valor, tempo_estimado, categoria, ativo ? 1 : 0, id);

    if (result.changes === 0) {
      throw new AppError('Serviço não encontrado', 404);
    }

    res.json({ message: 'Serviço atualizado com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const remove = (req, res, next) => {
  try {
    const { id } = req.params;

    const result = db.prepare('DELETE FROM servicos WHERE id = ?').run(id);

    if (result.changes === 0) {
      throw new AppError('Serviço não encontrado', 404);
    }

    res.json({ message: 'Serviço removido com sucesso' });
  } catch (error) {
    next(error);
  }
};

// Exportar serviços em CSV
export const exportCSV = (req, res, next) => {
  try {
    const servicos = db.prepare('SELECT * FROM servicos ORDER BY nome ASC').all();
    
    const headers = ['ID', 'Nome', 'Descrição', 'Valor', 'Tempo Estimado', 'Categoria', 'Ativo', 'Criado em'];
    const csvRows = [headers.join(',')];
    
    servicos.forEach(servico => {
      const row = [
        servico.id,
        `"${(servico.nome || '').replace(/"/g, '""')}"`,
        `"${(servico.descricao || '').replace(/"/g, '""')}"`,
        servico.valor || 0,
        servico.tempo_estimado || '',
        `"${(servico.categoria || '').replace(/"/g, '""')}"`,
        servico.ativo ? 'Sim' : 'Não',
        servico.created_at || ''
      ];
      csvRows.push(row.join(','));
    });
    
    const csv = csvRows.join('\n');
    const filename = `servicos_${new Date().toISOString().split('T')[0]}.csv`;
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\ufeff' + csv);
  } catch (error) {
    next(error);
  }
};

