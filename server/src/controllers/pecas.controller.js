import db from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const getAll = (req, res, next) => {
  try {
    const { search, categoria, estoque_baixo } = req.query;

    let query = 'SELECT * FROM pecas WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (nome LIKE ? OR codigo LIKE ? OR descricao LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (categoria) {
      query += ' AND categoria = ?';
      params.push(categoria);
    }

    if (estoque_baixo === 'true') {
      query += ' AND quantidade <= quantidade_minima';
    }

    query += ' ORDER BY nome ASC';

    const pecas = db.prepare(query).all(...params);
    res.json(pecas);
  } catch (error) {
    next(error);
  }
};

export const getById = (req, res, next) => {
  try {
    const peca = db.prepare('SELECT * FROM pecas WHERE id = ?').get(req.params.id);
    
    if (!peca) {
      throw new AppError('Peça não encontrada', 404);
    }

    res.json(peca);
  } catch (error) {
    next(error);
  }
};

export const create = (req, res, next) => {
  try {
    const { 
      nome, codigo, descricao, quantidade, quantidade_minima, 
      valor_unitario, localizacao, fornecedor, categoria 
    } = req.body;

    const result = db.prepare(`
      INSERT INTO pecas (
        nome, codigo, descricao, quantidade, quantidade_minima,
        valor_unitario, localizacao, fornecedor, categoria
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      nome, codigo, descricao, quantidade, quantidade_minima,
      valor_unitario, localizacao, fornecedor, categoria
    );

    res.status(201).json({
      message: 'Peça criada com sucesso',
      id: result.lastInsertRowid
    });
  } catch (error) {
    next(error);
  }
};

export const update = (req, res, next) => {
  try {
    const { 
      nome, codigo, descricao, quantidade, quantidade_minima,
      valor_unitario, localizacao, fornecedor, categoria, ativo 
    } = req.body;
    const { id } = req.params;

    const result = db.prepare(`
      UPDATE pecas 
      SET nome = ?, codigo = ?, descricao = ?, quantidade = ?, quantidade_minima = ?,
          valor_unitario = ?, localizacao = ?, fornecedor = ?, categoria = ?, ativo = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      nome, codigo, descricao, quantidade, quantidade_minima,
      valor_unitario, localizacao, fornecedor, categoria, ativo ? 1 : 0, id
    );

    if (result.changes === 0) {
      throw new AppError('Peça não encontrada', 404);
    }

    res.json({ message: 'Peça atualizada com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const updateQuantidade = (req, res, next) => {
  try {
    const { quantidade, operacao } = req.body; // operacao: 'adicionar' ou 'remover'
    const { id } = req.params;

    const peca = db.prepare('SELECT quantidade FROM pecas WHERE id = ?').get(id);
    if (!peca) {
      throw new AppError('Peça não encontrada', 404);
    }

    let novaQuantidade = peca.quantidade;
    if (operacao === 'adicionar') {
      novaQuantidade += quantidade;
    } else if (operacao === 'remover') {
      novaQuantidade -= quantidade;
      if (novaQuantidade < 0) {
        throw new AppError('Quantidade insuficiente em estoque', 400);
      }
    } else {
      throw new AppError('Operação inválida', 400);
    }

    db.prepare('UPDATE pecas SET quantidade = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(novaQuantidade, id);

    res.json({ 
      message: 'Quantidade atualizada com sucesso',
      novaQuantidade 
    });
  } catch (error) {
    next(error);
  }
};

export const remove = (req, res, next) => {
  try {
    const { id } = req.params;

    const result = db.prepare('DELETE FROM pecas WHERE id = ?').run(id);

    if (result.changes === 0) {
      throw new AppError('Peça não encontrada', 404);
    }

    res.json({ message: 'Peça removida com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const getEstoqueBaixo = (req, res, next) => {
  try {
    const pecas = db.prepare(`
      SELECT * FROM pecas 
      WHERE quantidade <= quantidade_minima AND ativo = 1
      ORDER BY (quantidade - quantidade_minima) ASC
    `).all();

    res.json(pecas);
  } catch (error) {
    next(error);
  }
};

// Exportar peças em CSV
export const exportCSV = (req, res, next) => {
  try {
    const pecas = db.prepare('SELECT * FROM pecas ORDER BY nome ASC').all();
    
    const headers = ['ID', 'Nome', 'Código', 'Descrição', 'Quantidade', 'Quantidade Mínima', 'Valor Unitário', 'Localização', 'Fornecedor', 'Categoria', 'Ativo', 'Criado em'];
    const csvRows = [headers.join(',')];
    
    pecas.forEach(peca => {
      const row = [
        peca.id,
        `"${(peca.nome || '').replace(/"/g, '""')}"`,
        `"${(peca.codigo || '').replace(/"/g, '""')}"`,
        `"${(peca.descricao || '').replace(/"/g, '""')}"`,
        peca.quantidade || 0,
        peca.quantidade_minima || 0,
        peca.valor_unitario || 0,
        `"${(peca.localizacao || '').replace(/"/g, '""')}"`,
        `"${(peca.fornecedor || '').replace(/"/g, '""')}"`,
        `"${(peca.categoria || '').replace(/"/g, '""')}"`,
        peca.ativo ? 'Sim' : 'Não',
        peca.created_at || ''
      ];
      csvRows.push(row.join(','));
    });
    
    const csv = csvRows.join('\n');
    const filename = `pecas_${new Date().toISOString().split('T')[0]}.csv`;
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\ufeff' + csv);
  } catch (error) {
    next(error);
  }
};

