import express from 'express';
import * as pecasController from '../controllers/pecas.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validatePeca, validateId } from '../middleware/validators.js';

const router = express.Router();

router.use(authenticate);

router.get('/', pecasController.getAll);
router.get('/estoque/baixo', pecasController.getEstoqueBaixo);
router.get('/:id', validateId, pecasController.getById);
router.post('/', validatePeca, pecasController.create);
router.put('/:id', validateId, validatePeca, pecasController.update);
router.patch('/:id/quantidade', validateId, pecasController.updateQuantidade);
router.delete('/:id', validateId, pecasController.remove);

export default router;

