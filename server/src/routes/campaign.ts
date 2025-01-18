import { Router } from 'express';
import { CampaignController } from '../controllers/CampaignController';
import { authMiddleware } from '../middlewares/auth';

const router = Router({ mergeParams: true });
const campaignController = new CampaignController();

router.use(authMiddleware);

router.post('/', (req, res) => campaignController.create(req, res));
router.get('/', (req, res) => campaignController.list(req, res));
router.patch('/:id', (req, res) => campaignController.update(req, res));
router.post('/:id/schedule', (req, res) => campaignController.schedule(req, res));
router.post('/:id/cancel', (req, res) => campaignController.cancel(req, res));

export default router;