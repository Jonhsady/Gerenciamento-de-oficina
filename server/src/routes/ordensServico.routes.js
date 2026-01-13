import express from 'express';
import * as ordensServicoController from '../controllers/ordensServico.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateOrdemServico, validateId } from '../middleware/validators.js';
import { checkLimit } from '../middleware/checkLimits.js';

const router = express.Router();

router.use(authenticate);

router.get('/', ordensServicoController.getAll);
router.get('/estatisticas', ordensServicoController.getEstatisticas);
router.get('/:id', validateId, ordensServicoController.getById);
router.post('/', checkLimit('os'), validateOrdemServico, ordensServicoController.create);
router.put('/:id', validateId, ordensServicoController.update);
router.patch('/:id/status', validateId, ordensServicoController.updateStatus);
router.delete('/:id', validateId, ordensServicoController.remove);

export default router;

