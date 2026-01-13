import express from 'express';
import * as servicosController from '../controllers/servicos.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateServico, validateId } from '../middleware/validators.js';

const router = express.Router();

router.use(authenticate);

router.get('/', servicosController.getAll);
router.get('/:id', validateId, servicosController.getById);
router.post('/', validateServico, servicosController.create);
router.put('/:id', validateId, validateServico, servicosController.update);
router.delete('/:id', validateId, servicosController.remove);

export default router;

