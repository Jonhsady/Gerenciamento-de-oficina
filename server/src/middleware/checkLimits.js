import db from '../config/database.js';
import { AppError } from './errorHandler.js';

// Verificar e incrementar uso
export const checkLimit = (tipo) => {
  return (req, res, next) => {
    try {
      const userId = req.user.id;
      
      // Buscar dados do usuário
      const user = db.prepare(`
        SELECT autorizado, limite_${tipo} as limite 
        FROM usuarios 
        WHERE id = ?
      `).get(userId);

      // Se usuário está autorizado ou é admin, não tem limite
      if (user.autorizado === 1 || req.user.role === 'admin') {
        return next();
      }

      // Buscar uso atual
      let uso = db.prepare(`
        SELECT quantidade 
        FROM uso_usuarios 
        WHERE usuario_id = ? AND tipo = ?
      `).get(userId, tipo);

      if (!uso) {
        // Criar registro de uso
        db.prepare(`
          INSERT INTO uso_usuarios (usuario_id, tipo, quantidade)
          VALUES (?, ?, 0)
        `).run(userId, tipo);
        uso = { quantidade: 0 };
      }

      // Verificar se atingiu o limite
      if (uso.quantidade >= user.limite) {
        throw new AppError(
          `Limite de ${tipo} atingido! Você criou ${uso.quantidade} de ${user.limite}. ` +
          `Entre em contato com o administrador para autorização completa.`,
          403
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Incrementar contador após criação
export const incrementUsage = (userId, tipo) => {
  try {
    // Verificar se usuário está autorizado
    const user = db.prepare('SELECT autorizado, role FROM usuarios WHERE id = ?').get(userId);
    
    // Se autorizado ou admin, não incrementa contador
    if (user && (user.autorizado === 1 || user.role === 'admin')) {
      return;
    }

    // Incrementar contador
    db.prepare(`
      INSERT INTO uso_usuarios (usuario_id, tipo, quantidade)
      VALUES (?, ?, 1)
      ON CONFLICT(usuario_id, tipo) 
      DO UPDATE SET quantidade = quantidade + 1
    `).run(userId, tipo);
  } catch (error) {
    console.error('Erro ao incrementar uso:', error);
  }
};

// Buscar status de uso do usuário
export const getUsageStatus = (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = db.prepare(`
      SELECT 
        autorizado,
        limite_clientes,
        limite_servicos,
        limite_pecas,
        limite_os
      FROM usuarios 
      WHERE id = ?
    `).get(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Se autorizado ou admin, retorna ilimitado
    if (user.autorizado === 1 || req.user.role === 'admin') {
      return res.json({
        autorizado: true,
        limites: null,
        uso: null
      });
    }

    // Buscar uso atual
    const usoAtual = db.prepare(`
      SELECT tipo, quantidade
      FROM uso_usuarios
      WHERE usuario_id = ?
    `).all(userId);

    const uso = {
      clientes: usoAtual.find(u => u.tipo === 'clientes')?.quantidade || 0,
      servicos: usoAtual.find(u => u.tipo === 'servicos')?.quantidade || 0,
      pecas: usoAtual.find(u => u.tipo === 'pecas')?.quantidade || 0,
      os: usoAtual.find(u => u.tipo === 'os')?.quantidade || 0
    };

    res.json({
      autorizado: false,
      limites: {
        clientes: user.limite_clientes,
        servicos: user.limite_servicos,
        pecas: user.limite_pecas,
        os: user.limite_os
      },
      uso
    });
  } catch (error) {
    next(error);
  }
};

