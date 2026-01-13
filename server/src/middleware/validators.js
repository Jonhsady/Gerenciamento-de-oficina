import { body, param, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Dados inválidos', 
      details: errors.array() 
    });
  }
  next();
};

// Validadores de Autenticação
export const validateLogin = [
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').notEmpty().withMessage('Senha é obrigatória'),
  validate
];

export const validateRegister = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
  validate
];

// Validadores de Cliente
export const validateCliente = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('telefone').optional().trim(),
  body('email').optional().isEmail().withMessage('Email inválido'),
  validate
];

// Validadores de Serviço
export const validateServico = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('valor').isFloat({ min: 0 }).withMessage('Valor deve ser um número positivo'),
  body('tempo_estimado').optional().isInt({ min: 0 }),
  body('categoria').optional().trim(),
  validate
];

// Validadores de Peça
export const validatePeca = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('codigo').optional().trim(),
  body('quantidade').isInt({ min: 0 }).withMessage('Quantidade deve ser um número inteiro positivo'),
  body('valor_unitario').isFloat({ min: 0 }).withMessage('Valor deve ser um número positivo'),
  validate
];

// Validadores de Ferramenta
export const validateFerramenta = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('codigo').optional().trim(),
  body('quantidade').optional().isInt({ min: 1 }),
  body('estado').optional().isIn(['Ótima', 'Boa', 'Regular', 'Ruim', 'Manutenção']),
  validate
];

// Validadores de Contato
export const validateContato = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('tipo').isIn(['Fornecedor', 'Parceiro', 'Cliente', 'Outro']).withMessage('Tipo inválido'),
  body('telefone').optional().trim(),
  body('email').optional().isEmail().withMessage('Email inválido'),
  validate
];

// Validadores de Ordem de Serviço
export const validateOrdemServico = [
  body('cliente_id').isInt({ min: 1 }).withMessage('Cliente ID é obrigatório'),
  body('veiculo_placa').optional().trim(),
  body('veiculo_modelo').optional().trim(),
  body('status').optional().isIn(['Aberta', 'Em Andamento', 'Aguardando Peças', 'Concluída', 'Cancelada']),
  validate
];

// Validador de ID
export const validateId = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  validate
];

