import { Router } from 'express';
import { TemplateController } from '../controllers/TemplateController';
import { authMiddleware } from '../middlewares/auth';

const router = Router({ mergeParams: true });
const templateController = new TemplateController();

router.use(authMiddleware);

router.post('/', (req, res) => templateController.create(req, res));
router.get('/', (req, res) => templateController.list(req, res));
router.patch('/:id', (req, res) => templateController.update(req, res));
router.post('/:id/preview', (req, res) => templateController.renderPreview(req, res));
router.post('/:id/duplicate', (req, res) => templateController.duplicate(req, res));
router.delete('/:id', (req, res) => templateController.delete(req, res));

export default router;