import express from 'express';
import * as contatosController from '../controllers/contatos.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateContato, validateId } from '../middleware/validators.js';

const router = express.Router();

router.use(authenticate);

router.get('/', contatosController.getAll);
router.get('/:id', validateId, contatosController.getById);
router.post('/', validateContato, contatosController.create);
router.put('/:id', validateId, validateContato, contatosController.update);
router.delete('/:id', validateId, contatosController.remove);

export default router;

