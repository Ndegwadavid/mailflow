// src/controllers/CampaignController.ts
import { Request, Response } from 'express';
import { CampaignService } from '../services/CampaignService';
import { CampaignType } from '../models/Campaign';

export class CampaignController {
    private campaignService: CampaignService;

    constructor() {
        this.campaignService = new CampaignService();
    }

    async create(req: Request, res: Response) {
        try {
            const { 
                name, 
                subject, 
                content, 
                type, 
                settings,
                scheduledFor 
            } = req.body;
            const organizationId = req.params.organizationId;

            if (!name || !subject || !content) {
                return res.status(400).json({ 
                    error: 'Name, subject, and content are required' 
                });
            }

            const campaign = await this.campaignService.create({
                name,
                subject,
                content,
                organizationId,
                type: type as CampaignType,
                settings,
                scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined
            });

            res.status(201).json(campaign);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, subject, content, settings, scheduledFor } = req.body;

            const campaign = await this.campaignService.update(id, {
                name,
                subject,
                content,
                settings,
                scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined
            });

            res.json(campaign);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async schedule(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { scheduledFor } = req.body;

            if (!scheduledFor) {
                return res.status(400).json({ 
                    error: 'Scheduled date is required' 
                });
            }

            const campaign = await this.campaignService.schedule(
                id,
                new Date(scheduledFor)
            );

            res.json(campaign);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async cancel(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const campaign = await this.campaignService.cancel(id);
            res.json(campaign);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const organizationId = req.params.organizationId;
            const { page, limit, status } = req.query;

            const result = await this.campaignService.getByOrganization(
                organizationId,
                {
                    page: page ? parseInt(page as string) : undefined,
                    limit: limit ? parseInt(limit as string) : undefined,
                    status: status as any
                }
            );

            res.json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}