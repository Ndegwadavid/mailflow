import { Router } from 'express';
import { OrganizationController } from '../controllers/OrganizationController';
import { authMiddleware, AuthenticatedRequest } from '../middlewares/auth';
import { Response } from 'express';

const router = Router();
const organizationController = new OrganizationController();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Organization routes
router.post('/', (req: AuthenticatedRequest, res: Response) => 
    organizationController.create(req, res)
);

router.get('/', (req: AuthenticatedRequest, res: Response) => 
    organizationController.getByUser(req, res)
);

router.get('/:id', (req: AuthenticatedRequest, res: Response) => 
    organizationController.getById(req, res)
);

export default router;