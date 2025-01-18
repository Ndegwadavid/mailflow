import { Repository, In } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Subscriber } from '../models/Subscriber';
import { Organization } from '../models/Organization';

export class SubscriberService {
    private subscriberRepository: Repository<Subscriber>;
    private organizationRepository: Repository<Organization>;

    constructor() {
        this.subscriberRepository = AppDataSource.getRepository(Subscriber);
        this.organizationRepository = AppDataSource.getRepository(Organization);
    }

    async create(data: {
        email: string;
        organizationId: string;
        metadata?: {
            firstName?: string;
            lastName?: string;
            phone?: string;
            address?: string;
            customFields?: Record<string, any>;
        };
        tags?: string[];
    }) {
        // Check for existing subscriber in the organization
        const existingSubscriber = await this.subscriberRepository.findOne({
            where: {
                email: data.email,
                organization: { id: data.organizationId }
            }
        });

        if (existingSubscriber) {
            throw new Error('Subscriber already exists in this organization');
        }

        // Get organization
        const organization = await this.organizationRepository.findOne({
            where: { id: data.organizationId }
        });

        if (!organization) {
            throw new Error('Organization not found');
        }

        // Create subscriber
        const subscriber = this.subscriberRepository.create({
            ...data,
            organization,
            tags: data.tags || [],
            subscriptionStatus: { subscribed: true }
        });

        return await this.subscriberRepository.save(subscriber);
    }

    async bulkImport(organizationId: string, subscribers: Array<{
        email: string;
        metadata?: any;
        tags?: string[];
    }>) {
        const organization = await this.organizationRepository.findOne({
            where: { id: organizationId }
        });

        if (!organization) {
            throw new Error('Organization not found');
        }

        // Get existing subscribers
        const existingEmails = await this.subscriberRepository.find({
            where: { 
                email: In(subscribers.map(s => s.email)),
                organization: { id: organizationId }
            },
            select: ['email']
        });

        const existingEmailSet = new Set(existingEmails.map(s => s.email));

        // Filter out duplicates
        const newSubscribers = subscribers.filter(s => !existingEmailSet.has(s.email));

        // Create new subscribers
        const subscribersToInsert = newSubscribers.map(s => 
            this.subscriberRepository.create({
                ...s,
                organization,
                tags: s.tags || [],
                subscriptionStatus: { subscribed: true }
            })
        );

        await this.subscriberRepository.save(subscribersToInsert);

        return {
            imported: subscribersToInsert.length,
            duplicates: subscribers.length - subscribersToInsert.length
        };
    }

    async update(id: string, data: {
        metadata?: any;
        tags?: string[];
        isActive?: boolean;
    }) {
        const subscriber = await this.subscriberRepository.findOne({
            where: { id }
        });

        if (!subscriber) {
            throw new Error('Subscriber not found');
        }

        Object.assign(subscriber, data);
        return await this.subscriberRepository.save(subscriber);
    }

    async unsubscribe(id: string, reason?: string) {
        const subscriber = await this.subscriberRepository.findOne({
            where: { id }
        });

        if (!subscriber) {
            throw new Error('Subscriber not found');
        }

        subscriber.subscriptionStatus = {
            subscribed: false,
            unsubscribedAt: new Date(),
            unsubscribeReason: reason
        };

        return await this.subscriberRepository.save(subscriber);
    }

    async getByOrganization(organizationId: string, options: {
        page?: number;
        limit?: number;
        tag?: string;
        isActive?: boolean;
    } = {}) {
        const { page = 1, limit = 10, tag, isActive } = options;
        const query = this.subscriberRepository.createQueryBuilder('subscriber')
            .where('subscriber.organization.id = :organizationId', { organizationId });

        if (tag) {
            query.andWhere(':tag = ANY(subscriber.tags)', { tag });
        }

        if (typeof isActive === 'boolean') {
            query.andWhere('subscriber.isActive = :isActive', { isActive });
        }

        const [subscribers, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            subscribers,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        };
    }

    async export(organizationId: string) {
        const subscribers = await this.subscriberRepository.find({
            where: { organization: { id: organizationId } }
        });

        return subscribers.map(s => ({
            email: s.email,
            metadata: s.metadata,
            tags: s.tags,
            isActive: s.isActive,
            subscriptionStatus: s.subscriptionStatus,
            createdAt: s.createdAt
        }));
    }
}