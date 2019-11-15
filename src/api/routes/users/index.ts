import { Router } from 'express';
import UserController from '../../controllers/UserController';
const router = Router();

router.get(':userId', UserController.store);

router.post(':userId', UserController.add);

router.delete(':userId', UserController.delete);

router.put(':userId', UserController.update);

export default router;
