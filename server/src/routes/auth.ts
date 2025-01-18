import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware, AuthenticatedRequest } from '../middlewares/auth';
import { Response } from 'express';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/request-reset', (req, res) => authController.requestPasswordReset(req, res));
router.post('/reset-password', (req, res) => authController.resetPassword(req, res));

// Protected routes
router.post('/change-password', 
    authMiddleware,
    (req: AuthenticatedRequest, res: Response) => authController.changePassword(req, res)
);

export default router;