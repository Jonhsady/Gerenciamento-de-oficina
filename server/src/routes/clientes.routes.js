import express from 'express';
import * as clientesController from '../controllers/clientes.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateCliente, validateId } from '../middleware/validators.js';
import { checkLimit } from '../middleware/checkLimits.js';

const router = express.Router();

router.use(authenticate);

router.get('/', clientesController.getAll);
router.get('/:id', validateId, clientesController.getById);
router.post('/', checkLimit('clientes'), validateCliente, clientesController.create);
router.put('/:id', validateId, validateCliente, clientesController.update);
router.delete('/:id', validateId, clientesController.remove);

export default router;

