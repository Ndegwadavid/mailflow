// src/controllers/TrackingController.ts
import { Request, Response } from 'express';
import { AnalyticsService } from '../services/AnalyticsService';
import { EventType } from '../models/Analytics';

export class TrackingController {
    private analyticsService: AnalyticsService;

    constructor() {
        this.analyticsService = new AnalyticsService();
    }

    async trackPixel(req: Request, res: Response) {
        try {
            const { campaignId, subscriberId } = req.params;

            // Track open event
            await this.analyticsService.trackEvent({
                campaignId,
                subscriberId,
                eventType: EventType.OPENED,
                metadata: {
                    userAgent: req.headers['user-agent'],
                    ipAddress: req.ip
                }
            });

            // Return a 1x1 transparent pixel
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Cache-Control', 'no-cache, no-store');
            res.send(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
        } catch (error: any) {
            console.error('Tracking pixel error:', error);
            // Still return pixel to avoid breaking email client
            res.setHeader('Content-Type', 'image/png');
            res.send(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
        }
    }

    async trackClick(req: Request, res: Response) {
        try {
            const { campaignId, subscriberId } = req.params;
            const { url } = req.query;

            if (!url) {
                return res.status(400).json({ error: 'URL parameter is required' });
            }

            // Track click event
            await this.analyticsService.trackEvent({
                campaignId,
                subscriberId,
                eventType: EventType.CLICKED,
                metadata: {
                    url,
                    userAgent: req.headers['user-agent'],
                    ipAddress: req.ip
                }
            });

            // Redirect to the original URL
            res.redirect(url as string);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getMetrics(req: Request, res: Response) {
        try {
            const { campaignId } = req.params;
            const metrics = await this.analyticsService.getCampaignMetrics(campaignId);
            res.json(metrics);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getOrganizationMetrics(req: Request, res: Response) {
        try {
            const { organizationId } = req.params;
            const { start, end } = req.query;

            const metrics = await this.analyticsService.getOrganizationMetrics(
                organizationId,
                {
                    start: new Date(start as string),
                    end: new Date(end as string)
                }
            );

            res.json(metrics);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}