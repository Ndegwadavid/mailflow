// src/controllers/SubscriberController.ts
import { Request, Response } from 'express';
import { SubscriberService } from '../services/SubscriberService';
import { validateEmail } from '../utils/validation';

export class SubscriberController {
    private subscriberService: SubscriberService;

    constructor() {
        this.subscriberService = new SubscriberService();
    }

    async create(req: Request, res: Response) {
        try {
            const { email, metadata, tags } = req.body;
            const organizationId = req.params.organizationId;

            if (!email || !validateEmail(email)) {
                return res.status(400).json({ error: 'Valid email is required' });
            }

            const subscriber = await this.subscriberService.create({
                email,
                organizationId,
                metadata,
                tags
            });

            res.status(201).json(subscriber);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async bulkImport(req: Request, res: Response) {
        try {
            const { subscribers } = req.body;
            const organizationId = req.params.organizationId;

            if (!Array.isArray(subscribers) || subscribers.length === 0) {
                return res.status(400).json({ error: 'Valid subscribers array is required' });
            }

            // Validate all emails
            const invalidEmails = subscribers.filter(s => !validateEmail(s.email));
            if (invalidEmails.length > 0) {
                return res.status(400).json({ 
                    error: 'Invalid emails found',
                    invalidEmails: invalidEmails.map(s => s.email)
                });
            }

            const result = await this.subscriberService.bulkImport(organizationId, subscribers);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { metadata, tags, isActive } = req.body;

            const subscriber = await this.subscriberService.update(id, {
                metadata,
                tags,
                isActive
            });

            res.json(subscriber);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async unsubscribe(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { reason } = req.body;

            const subscriber = await this.subscriberService.unsubscribe(id, reason);
            res.json(subscriber);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const organizationId = req.params.organizationId;
            const { page, limit, tag, isActive } = req.query;

            const result = await this.subscriberService.getByOrganization(organizationId, {
                page: parseInt(page as string) || 1,
                limit: parseInt(limit as string) || 10,
                tag: tag as string,
                isActive: isActive ? (isActive === 'true') : undefined
            });

            res.json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async export(req: Request, res: Response) {
        try {
            const organizationId = req.params.organizationId;
            const subscribers = await this.subscriberService.export(organizationId);

            // Send as CSV
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');

            // Convert to CSV format
            const csv = [
                'Email,First Name,Last Name,Phone,Address,Tags,Status,Created At',
                ...subscribers.map(s => [
                    s.email,
                    s.metadata?.firstName || '',
                    s.metadata?.lastName || '',
                    s.metadata?.phone || '',
                    s.metadata?.address || '',
                    s.tags.join(';'),
                    s.subscriptionStatus.subscribed ? 'Subscribed' : 'Unsubscribed',
                    s.createdAt
                ].join(','))
            ].join('\n');

            res.send(csv);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}