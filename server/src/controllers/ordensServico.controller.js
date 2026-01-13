import db from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { incrementUsage } from '../middleware/checkLimits.js';

// Gera número único de OS
const gerarNumeroOS = () => {
  const ano = new Date().getFullYear();
  const ultimaOS = db.prepare(
    'SELECT numero_os FROM ordens_servico ORDER BY id DESC LIMIT 1'
  ).get();
  
  let sequencial = 1;
  if (ultimaOS) {
    const match = ultimaOS.numero_os.match(/\d+$/);
    if (match) {
      sequencial = parseInt(match[0]) + 1;
    }
  }
  
  return `OS${ano}${String(sequencial).padStart(5, '0')}`;
};

export const getAll = (req, res, next) => {
  try {
    const { status, cliente_id, data_inicio, data_fim } = req.query;

    let query = `
      SELECT os.*, c.nome as cliente_nome
      FROM ordens_servico os
      LEFT JOIN clientes c ON os.cliente_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND os.status = ?';
      params.push(status);
    }

    if (cliente_id) {
      query += ' AND os.cliente_id = ?';
      params.push(cliente_id);
    }

    if (data_inicio) {
      query += ' AND DATE(os.data_abertura) >= ?';
      params.push(data_inicio);
    }

    if (data_fim) {
      query += ' AND DATE(os.data_abertura) <= ?';
      params.push(data_fim);
    }

    query += ' ORDER BY os.data_abertura DESC';

    const ordens = db.prepare(query).all(...params);
    res.json(ordens);
  } catch (error) {
    next(error);
  }
};

export const getById = (req, res, next) => {
  try {
    const os = db.prepare(`
      SELECT os.*, c.nome as cliente_nome, c.telefone as cliente_telefone
      FROM ordens_servico os
      LEFT JOIN clientes c ON os.cliente_id = c.id
      WHERE os.id = ?
    `).get(req.params.id);
    
    if (!os) {
      throw new AppError('Ordem de serviço não encontrada', 404);
    }

    // Buscar serviços da OS
    const servicos = db.prepare(`
      SELECT oss.*, s.nome as servico_nome
      FROM os_servicos oss
      LEFT JOIN servicos s ON oss.servico_id = s.id
      WHERE oss.ordem_servico_id = ?
    `).all(os.id);

    // Buscar peças da OS
    const pecas = db.prepare(`
      SELECT osp.*, p.nome as peca_nome
      FROM os_pecas osp
      LEFT JOIN pecas p ON osp.peca_id = p.id
      WHERE osp.ordem_servico_id = ?
    `).all(os.id);

    res.json({ ...os, servicos, pecas });
  } catch (error) {
    next(error);
  }
};

export const create = (req, res, next) => {
  try {
    const { 
      cliente_id, veiculo_placa, veiculo_modelo, veiculo_ano,
      data_prevista, observacoes, servicos = [], pecas = []
    } = req.body;

    const numero_os = gerarNumeroOS();

    // Calcular valor total
    let valor_total = 0;
    servicos.forEach(s => valor_total += s.valor_unitario * s.quantidade);
    pecas.forEach(p => valor_total += p.valor_unitario * p.quantidade);

    // Iniciar transação
    const insertOS = db.transaction(() => {
      const result = db.prepare(`
        INSERT INTO ordens_servico (
          numero_os, cliente_id, veiculo_placa, veiculo_modelo, veiculo_ano,
          data_prevista, valor_total, observacoes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        numero_os, cliente_id, veiculo_placa, veiculo_modelo, veiculo_ano,
        data_prevista, valor_total, observacoes
      );

      const osId = result.lastInsertRowid;

      // Inserir serviços
      servicos.forEach(servico => {
        db.prepare(`
          INSERT INTO os_servicos (ordem_servico_id, servico_id, quantidade, valor_unitario, valor_total)
          VALUES (?, ?, ?, ?, ?)
        `).run(
          osId, servico.servico_id, servico.quantidade,
          servico.valor_unitario, servico.valor_unitario * servico.quantidade
        );
      });

      // Inserir peças e atualizar estoque
      pecas.forEach(peca => {
        db.prepare(`
          INSERT INTO os_pecas (ordem_servico_id, peca_id, quantidade, valor_unitario, valor_total)
          VALUES (?, ?, ?, ?, ?)
        `).run(
          osId, peca.peca_id, peca.quantidade,
          peca.valor_unitario, peca.valor_unitario * peca.quantidade
        );

        // Atualizar estoque
        db.prepare('UPDATE pecas SET quantidade = quantidade - ? WHERE id = ?')
          .run(peca.quantidade, peca.peca_id);
      });

      return osId;
    });

    const osId = insertOS();

    // Incrementar contador de uso
    incrementUsage(req.user.id, 'os');

    res.status(201).json({
      message: 'Ordem de serviço criada com sucesso',
      id: osId,
      numero_os
    });
  } catch (error) {
    next(error);
  }
};

export const update = (req, res, next) => {
  try {
    const { 
      status, veiculo_placa, veiculo_modelo, veiculo_ano,
      data_prevista, data_conclusao, observacoes 
    } = req.body;
    const { id } = req.params;

    const result = db.prepare(`
      UPDATE ordens_servico 
      SET status = ?, veiculo_placa = ?, veiculo_modelo = ?, veiculo_ano = ?,
          data_prevista = ?, data_conclusao = ?, observacoes = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      status, veiculo_placa, veiculo_modelo, veiculo_ano,
      data_prevista, data_conclusao, observacoes, id
    );

    if (result.changes === 0) {
      throw new AppError('Ordem de serviço não encontrada', 404);
    }

    res.json({ message: 'Ordem de serviço atualizada com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const data_conclusao = status === 'Concluída' ? new Date().toISOString() : null;

    const result = db.prepare(`
      UPDATE ordens_servico 
      SET status = ?, data_conclusao = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, data_conclusao, id);

    if (result.changes === 0) {
      throw new AppError('Ordem de serviço não encontrada', 404);
    }

    res.json({ message: 'Status atualizado com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const remove = (req, res, next) => {
  try {
    const { id } = req.params;

    // Buscar peças para devolver ao estoque
    const pecas = db.prepare('SELECT peca_id, quantidade FROM os_pecas WHERE ordem_servico_id = ?')
      .all(id);

    const deleteOS = db.transaction(() => {
      // Devolver peças ao estoque
      pecas.forEach(peca => {
        db.prepare('UPDATE pecas SET quantidade = quantidade + ? WHERE id = ?')
          .run(peca.quantidade, peca.peca_id);
      });

      // Deletar OS (os itens serão deletados por cascade)
      const result = db.prepare('DELETE FROM ordens_servico WHERE id = ?').run(id);
      if (result.changes === 0) {
        throw new AppError('Ordem de serviço não encontrada', 404);
      }
    });

    deleteOS();

    res.json({ message: 'Ordem de serviço removida com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const getEstatisticas = (req, res, next) => {
  try {
    const stats = {
      total: db.prepare('SELECT COUNT(*) as count FROM ordens_servico').get().count,
      abertas: db.prepare("SELECT COUNT(*) as count FROM ordens_servico WHERE status = 'Aberta'").get().count,
      em_andamento: db.prepare("SELECT COUNT(*) as count FROM ordens_servico WHERE status = 'Em Andamento'").get().count,
      concluidas: db.prepare("SELECT COUNT(*) as count FROM ordens_servico WHERE status = 'Concluída'").get().count,
      valor_total: db.prepare("SELECT SUM(valor_total) as total FROM ordens_servico WHERE status = 'Concluída'").get().total || 0
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
};

