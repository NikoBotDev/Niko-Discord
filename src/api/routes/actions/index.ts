import { Router, Request, Response } from 'express';
import ActionsController from '../../controllers/ActionsController';
const router = Router();

router.get('/:type', ActionsController.store);

router.post('/:type', ActionsController.add);

router.delete('/:type', ActionsController.delete);

export default router;
