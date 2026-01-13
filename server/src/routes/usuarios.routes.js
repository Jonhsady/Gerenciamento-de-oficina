import express from 'express';
import * as usuariosController from '../controllers/usuarios.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { getUsageStatus } from '../middleware/checkLimits.js';

const router = express.Router();

// Rota para qualquer usuário autenticado ver seus limites
router.get('/me/usage', authenticate, getUsageStatus);

// Rotas apenas para admin
router.use(authenticate, authorize('admin'));

router.get('/', usuariosController.getAll);
router.patch('/:id/authorize', usuariosController.authorize);
router.patch('/:id/limits', usuariosController.updateLimits);
router.patch('/:id/toggle-active', usuariosController.toggleActive);
router.delete('/:id/reset-usage', usuariosController.resetUsage);

export default router;

