// src/services/OrganizationService.ts
import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Organization } from '../models/Organization';
import { User } from '../models/User';

export class OrganizationService {
    private orgRepository: Repository<Organization>;
    private userRepository: Repository<User>;

    constructor() {
        this.orgRepository = AppDataSource.getRepository(Organization);
        this.userRepository = AppDataSource.getRepository(User);
    }

    async create(data: {
        name: string;
        description?: string;
        ownerId: string;
    }) {
        try {
            const owner = await this.userRepository.findOne({
                where: { id: data.ownerId }
            });

            if (!owner) {
                throw new Error('Owner not found');
            }

            const slug = this.generateSlug(data.name);
            const existingOrg = await this.orgRepository.findOne({
                where: { slug }
            });

            if (existingOrg) {
                throw new Error('Organization with similar name already exists');
            }

            const organization = this.orgRepository.create({
                ...data,
                slug,
                owner,
                settings: {
                    emailCustomization: {
                        fromName: data.name,
                        fromEmail: `noreply@${slug}.mailflow.com`
                    },
                    brandColors: {
                        primary: '#007bff',
                        secondary: '#6c757d'
                    }
                }
            });

            await this.orgRepository.save(organization);
            return organization;
        } catch (error) {
            throw error;
        }
    }

    async getByUserId(userId: string) {
        return await this.orgRepository.find({
            where: { owner: { id: userId } },
            relations: ['owner']
        });
    }

    async getById(id: string) {
        const organization = await this.orgRepository.findOne({
            where: { id },
            relations: ['owner', 'subscribers', 'campaigns']
        });

        if (!organization) {
            throw new Error('Organization not found');
        }

        return organization;
    }

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }
}