import { Repository, Between } from 'typeorm';
import { AppDataSource } from '../config/database';
import { EmailEvent, EventType } from '../models/Analytics';
import { Campaign } from '../models/Campaign';
import { Organization } from '../models/Organization';

export class AnalyticsService {
    private eventRepository: Repository<EmailEvent>;
    private campaignRepository: Repository<Campaign>;

    constructor() {
        this.eventRepository = AppDataSource.getRepository(EmailEvent);
        this.campaignRepository = AppDataSource.getRepository(Campaign);
    }

    async trackEvent(data: {
        campaignId: string;
        subscriberId: string;
        eventType: EventType;
        metadata?: any;
    }) {
        const event = this.eventRepository.create(data);
        await this.eventRepository.save(event);

        // Update campaign metrics
        const campaign = await this.campaignRepository.findOne({
            where: { id: data.campaignId }
        });

        if (campaign) {
            campaign.metrics = {
                ...campaign.metrics,
                [data.eventType]: (campaign.metrics?.[data.eventType] || 0) + 1
            };
            await this.campaignRepository.save(campaign);
        }
    }

    async getCampaignMetrics(campaignId: string) {
        const events = await this.eventRepository.find({
            where: { campaignId }
        });

        const metrics = {
            total: events.length,
            sent: 0,
            delivered: 0,
            opened: 0,
            clicked: 0,
            bounced: 0,
            complained: 0
        };

        events.forEach(event => {
            switch (event.eventType) {
                case EventType.SENT:
                    metrics.sent++;
                    break;
                case EventType.DELIVERED:
                    metrics.delivered++;
                    break;
                case EventType.OPENED:
                    metrics.opened++;
                    break;
                case EventType.CLICKED:
                    metrics.clicked++;
                    break;
                case EventType.BOUNCED:
                    metrics.bounced++;
                    break;
                case EventType.COMPLAINED:
                    metrics.complained++;
                    break;
            }
        });

        return {
            ...metrics,
            openRate: metrics.opened / metrics.delivered || 0,
            clickRate: metrics.clicked / metrics.opened || 0,
            bounceRate: metrics.bounced / metrics.sent || 0
        };
    }

    async getOrganizationMetrics(organizationId: string, dateRange: {
        start: Date;
        end: Date;
    }) {
        const campaigns = await this.campaignRepository.find({
            where: {
                organization: { id: organizationId },
                createdAt: Between(dateRange.start, dateRange.end)
            }
        });

        const metrics = await Promise.all(
            campaigns.map(campaign => this.getCampaignMetrics(campaign.id))
        );

        return {
            campaigns: campaigns.length,
            totalSent: metrics.reduce((sum, m) => sum + m.sent, 0),
            totalDelivered: metrics.reduce((sum, m) => sum + m.delivered, 0),
            totalOpened: metrics.reduce((sum, m) => sum + m.opened, 0),
            totalClicked: metrics.reduce((sum, m) => sum + m.clicked, 0),
            averageOpenRate: metrics.reduce((sum, m) => sum + m.openRate, 0) / metrics.length,
            averageClickRate: metrics.reduce((sum, m) => sum + m.clickRate, 0) / metrics.length
        };
    }

    async generateTrackingPixel(campaignId: string, subscriberId: string): Promise<string> {
        // Generate a unique tracking pixel URL
        return `/api/tracking/pixel/${campaignId}/${subscriberId}`;
    }

    async generateTrackingLink(
        campaignId: string,
        subscriberId: string,
        originalUrl: string
    ): Promise<string> {
        // Generate a unique tracking link
        return `/api/tracking/click/${campaignId}/${subscriberId}?url=${encodeURIComponent(originalUrl)}`;
    }
}