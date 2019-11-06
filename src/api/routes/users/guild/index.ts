import { Router } from 'express';
import GuildUserController from '../../../controllers/GuildUserController';
const router = Router();

router.get('/:guildId/:userId', GuildUserController.store);

router.post('/:guildId/:userId', GuildUserController.add);

router.delete('/:guildId/:userId', GuildUserController.delete);

router.put('/:guildId/:userId', GuildUserController.update);

export default router;
