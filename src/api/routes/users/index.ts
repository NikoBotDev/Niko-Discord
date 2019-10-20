import { Router, Request, Response } from 'express';

const router = Router();

router.get(':userId', (req: Request, res: Response) => {});

router.post(':userId', (req: Request, res: Response) => {});

router.delete(':userId', (req: Request, res: Response) => {});

router.put(':userId', (req: Request, res: Response) => {});

export default router;
