import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const register = async (req, res, next) => {
  try {
    const { nome, email, senha, role = 'usuario' } = req.body;

    // Verificar se usuário já existe
    const existingUser = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
    if (existingUser) {
      throw new AppError('Email já cadastrado', 409);
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Inserir usuário
    const result = db.prepare(`
      INSERT INTO usuarios (nome, email, senha, role)
      VALUES (?, ?, ?, ?)
    `).run(nome, email, hashedPassword, role);

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      userId: result.lastInsertRowid
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    // Buscar usuário
    const user = db.prepare('SELECT * FROM usuarios WHERE email = ? AND ativo = 1').get(email);
    if (!user) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // Gerar token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        nome: user.nome
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = (req, res, next) => {
  try {
    const user = db.prepare('SELECT id, nome, email, role, created_at FROM usuarios WHERE id = ?')
      .get(req.user.id);
    
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { nome, email, senha_atual, senha_nova } = req.body;
    const userId = req.user.id;

    const user = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(userId);
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Se quiser trocar senha, validar senha atual
    if (senha_nova) {
      if (!senha_atual) {
        throw new AppError('Senha atual é obrigatória para trocar a senha', 400);
      }
      
      const validPassword = await bcrypt.compare(senha_atual, user.senha);
      if (!validPassword) {
        throw new AppError('Senha atual incorreta', 401);
      }

      const hashedPassword = await bcrypt.hash(senha_nova, 10);
      db.prepare('UPDATE usuarios SET senha = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(hashedPassword, userId);
    }

    // Atualizar outros dados
    if (nome || email) {
      const updateNome = nome || user.nome;
      const updateEmail = email || user.email;

      db.prepare('UPDATE usuarios SET nome = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(updateNome, updateEmail, userId);
    }

    res.json({ message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    next(error);
  }
};

