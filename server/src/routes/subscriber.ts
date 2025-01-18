import { Router } from 'express';
import { SubscriberController } from '../controllers/SubscriberController';
import { authMiddleware } from '../middlewares/auth';
import { createRateLimiter } from '../middlewares/rateLimit';

const router = Router({ mergeParams: true }); // Enable access to parent router params
const subscriberController = new SubscriberController();

// Rate limiters
const importRateLimiter = createRateLimiter('subscriber-import', 5, 60 * 1000); // 5 imports per minute

// Apply auth middleware to all routes
router.use(authMiddleware);

// Subscriber routes
router.post('/', (req, res) => subscriberController.create(req, res));
router.post('/import', importRateLimiter, (req, res) => subscriberController.bulkImport(req, res));
router.get('/', (req, res) => subscriberController.list(req, res));
router.get('/export', (req, res) => subscriberController.export(req, res));
router.patch('/:id', (req, res) => subscriberController.update(req, res));
router.post('/:id/unsubscribe', (req, res) => subscriberController.unsubscribe(req, res));

export default router;