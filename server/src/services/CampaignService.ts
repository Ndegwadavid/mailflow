import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Campaign, CampaignStatus, CampaignType } from '../models/Campaign';
import { Organization } from '../models/Organization';

export class CampaignService {
    private campaignRepository: Repository<Campaign>;
    private organizationRepository: Repository<Organization>;

    constructor() {
        this.campaignRepository = AppDataSource.getRepository(Campaign);
        this.organizationRepository = AppDataSource.getRepository(Organization);
    }

    async create(data: {
        name: string;
        subject: string;
        content: string;
        organizationId: string;
        type?: CampaignType;
        settings?: {
            fromName?: string;
            fromEmail?: string;
            replyTo?: string;
            trackOpens?: boolean;
            trackClicks?: boolean;
        };
        scheduledFor?: Date;
    }) {
        const organization = await this.organizationRepository.findOne({
            where: { id: data.organizationId }
        });

        if (!organization) {
            throw new Error('Organization not found');
        }

        const campaign = this.campaignRepository.create({
            ...data,
            organization,
            status: data.scheduledFor ? CampaignStatus.SCHEDULED : CampaignStatus.DRAFT,
            type: data.type || CampaignType.REGULAR,
            settings: {
                fromName: data.settings?.fromName || organization.name,
                fromEmail: data.settings?.fromEmail || `noreply@${organization.slug}.mailflow.com`,
                replyTo: data.settings?.replyTo,
                trackOpens: data.settings?.trackOpens ?? true,
                trackClicks: data.settings?.trackClicks ?? true
            },
            metrics: {
                totalRecipients: 0,
                sent: 0,
                delivered: 0,
                opened: 0,
                clicked: 0,
                bounced: 0,
                complained: 0,
                unsubscribed: 0
            }
        });

        return await this.campaignRepository.save(campaign);
    }

    async update(id: string, data: {
        name?: string;
        subject?: string;
        content?: string;
        settings?: any;
        scheduledFor?: Date;
    }) {
        const campaign = await this.campaignRepository.findOne({
            where: { id }
        });

        if (!campaign) {
            throw new Error('Campaign not found');
        }

        if (campaign.status !== CampaignStatus.DRAFT && campaign.status !== CampaignStatus.SCHEDULED) {
            throw new Error('Cannot update campaign that has been sent or is sending');
        }

        Object.assign(campaign, {
            ...data,
            status: data.scheduledFor ? CampaignStatus.SCHEDULED : CampaignStatus.DRAFT
        });

        return await this.campaignRepository.save(campaign);
    }

    async schedule(id: string, scheduledFor: Date) {
        const campaign = await this.campaignRepository.findOne({
            where: { id }
        });

        if (!campaign) {
            throw new Error('Campaign not found');
        }

        if (campaign.status !== CampaignStatus.DRAFT) {
            throw new Error('Only draft campaigns can be scheduled');
        }

        if (scheduledFor <= new Date()) {
            throw new Error('Schedule time must be in the future');
        }

        campaign.scheduledFor = scheduledFor;
        campaign.status = CampaignStatus.SCHEDULED;

        return await this.campaignRepository.save(campaign);
    }

    async cancel(id: string) {
        const campaign = await this.campaignRepository.findOne({
            where: { id }
        });

        if (!campaign) {
            throw new Error('Campaign not found');
        }

        if (campaign.status !== CampaignStatus.SCHEDULED) {
            throw new Error('Only scheduled campaigns can be cancelled');
        }

        campaign.status = CampaignStatus.CANCELLED;
        return await this.campaignRepository.save(campaign);
    }

    async getByOrganization(organizationId: string, options: {
        page?: number;
        limit?: number;
        status?: CampaignStatus;
    } = {}) {
        const { page = 1, limit = 10, status } = options;
        
        const queryBuilder = this.campaignRepository.createQueryBuilder('campaign')
            .where('campaign.organization.id = :organizationId', { organizationId })
            .orderBy('campaign.createdAt', 'DESC');

        if (status) {
            queryBuilder.andWhere('campaign.status = :status', { status });
        }

        const [campaigns, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            campaigns,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        };
    }

    async getScheduledCampaigns() {
        return await this.campaignRepository.find({
            where: {
                status: CampaignStatus.SCHEDULED,
                scheduledFor: LessThanOrEqual(new Date())
            },
            relations: ['organization']
        });
    }

    async updateMetrics(id: string, metrics: {
        sent?: number;
        delivered?: number;
        opened?: number;
        clicked?: number;
        bounced?: number;
        complained?: number;
        unsubscribed?: number;
    }) {
        const campaign = await this.campaignRepository.findOne({
            where: { id }
        });

        if (!campaign) {
            throw new Error('Campaign not found');
        }

        campaign.metrics = {
            ...campaign.metrics,
            ...metrics
        };

        return await this.campaignRepository.save(campaign);
    }
}