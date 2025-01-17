import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

interface RegisterRequest extends Request {
    body: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }
}

interface LoginRequest extends Request {
    body: {
        email: string;
        password: string;
    }
}

export class AuthController {
    private authService = new AuthService();

    async register(req: RegisterRequest, res: Response): Promise<void> {
        try {
            const { firstName, lastName, email, password } = req.body;
            const result = await this.authService.register({
                firstName,
                lastName,
                email,
                password
            });
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req: LoginRequest, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }
}