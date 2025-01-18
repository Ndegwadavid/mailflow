// src/controllers/TemplateController.ts
import { Request, Response } from 'express';
import { TemplateService } from '../services/TemplateService';

export class TemplateController {
    private templateService: TemplateService;

    constructor() {
        this.templateService = new TemplateService();
    }

    async create(req: Request, res: Response) {
        try {
            const { 
                name, 
                content, 
                category,
                description,
                previewData 
            } = req.body;
            const organizationId = req.params.organizationId;

            if (!name || !content) {
                return res.status(400).json({ 
                    error: 'Name and content are required' 
                });
            }

            const template = await this.templateService.create({
                name,
                content,
                organizationId,
                category,
                description,
                previewData
            });

            res.status(201).json(template);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { 
                name, 
                content, 
                category,
                description,
                previewData 
            } = req.body;

            const template = await this.templateService.update(id, {
                name,
                content,
                category,
                description,
                previewData
            });

            res.json(template);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const organizationId = req.params.organizationId;
            const { page, limit, category } = req.query;

            const result = await this.templateService.getByOrganization(
                organizationId,
                {
                    page: page ? parseInt(page as string) : undefined,
                    limit: limit ? parseInt(limit as string) : undefined,
                    category: category as string
                }
            );

            res.json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async renderPreview(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { data } = req.body;

            const rendered = await this.templateService.renderTemplate(id, data);
            res.json({ content: rendered });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async duplicate(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const template = await this.templateService.duplicate(id);
            res.json(template);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.templateService.delete(id);
            res.json({ success: true });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}