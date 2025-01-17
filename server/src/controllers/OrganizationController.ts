import { Request, Response } from 'express';
import { OrganizationService } from '../services/OrganizationService';
import { User } from '../models/User';

interface AuthenticatedRequest extends Request {
    user?: User;
    body: {
        name: string;
        description?: string;
    }
}

export class OrganizationController {
    private orgService: OrganizationService;

    constructor() {
        this.orgService = new OrganizationService();
    }

    async create(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { name, description } = req.body;
            if (!req.user?.id) {
                res.status(401).json({ error: 'User not authenticated' });
                return;
            }

            const organization = await this.orgService.create({
                name,
                description,
                ownerId: req.user.id
            });
            
            res.status(201).json(organization);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getByUser(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'User not authenticated' });
                return;
            }

            const organizations = await this.orgService.getByUserId(req.user.id);
            res.json(organizations);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const organization = await this.orgService.getById(id);
            res.json(organization);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }
}