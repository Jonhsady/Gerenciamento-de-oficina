import express from 'express';
import * as ferramentasController from '../controllers/ferramentas.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateFerramenta, validateId } from '../middleware/validators.js';

const router = express.Router();

router.use(authenticate);

router.get('/', ferramentasController.getAll);
router.get('/:id', validateId, ferramentasController.getById);
router.post('/', validateFerramenta, ferramentasController.create);
router.put('/:id', validateId, validateFerramenta, ferramentasController.update);
router.patch('/:id/uso', validateId, ferramentasController.toggleUso);
router.delete('/:id', validateId, ferramentasController.remove);

export default router;

