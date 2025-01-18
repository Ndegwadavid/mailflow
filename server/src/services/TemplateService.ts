import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Template } from '../models/Template';
import { Organization } from '../models/Organization';

export class TemplateService {
    private templateRepository: Repository<Template>;
    private organizationRepository: Repository<Organization>;

    constructor() {
        this.templateRepository = AppDataSource.getRepository(Template);
        this.organizationRepository = AppDataSource.getRepository(Organization);
    }

    async create(data: {
        name: string;
        content: string;
        organizationId: string;
        category?: string;
        description?: string;
        previewData?: Record<string, any>;
    }) {
        const organization = await this.organizationRepository.findOne({
            where: { id: data.organizationId }
        });

        if (!organization) {
            throw new Error('Organization not found');
        }

        const template = this.templateRepository.create({
            ...data,
            organization,
            variables: this.extractVariables(data.content)
        });

        return await this.templateRepository.save(template);
    }

    async update(id: string, data: {
        name?: string;
        content?: string;
        category?: string;
        description?: string;
        previewData?: Record<string, any>;
    }) {
        const template = await this.templateRepository.findOne({
            where: { id }
        });

        if (!template) {
            throw new Error('Template not found');
        }

        if (data.content) {
            data.variables = this.extractVariables(data.content);
        }

        Object.assign(template, data);
        return await this.templateRepository.save(template);
    }

    async getByOrganization(organizationId: string, options: {
        page?: number;
        limit?: number;
        category?: string;
    } = {}) {
        const { page = 1, limit = 10, category } = options;

        const queryBuilder = this.templateRepository.createQueryBuilder('template')
            .where('template.organization.id = :organizationId', { organizationId });

        if (category) {
            queryBuilder.andWhere('template.category = :category', { category });
        }

        const [templates, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            templates,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        };
    }

    async renderTemplate(templateId: string, data: Record<string, any>) {
        const template = await this.templateRepository.findOne({
            where: { id: templateId }
        });

        if (!template) {
            throw new Error('Template not found');
        }

        let rendered = template.content;
        template.variables.forEach(variable => {
            const value = data[variable] || '';
            rendered = rendered.replace(new RegExp(`{{${variable}}}`, 'g'), value);
        });

        return rendered;
    }

    private extractVariables(content: string): string[] {
        const variableRegex = /{{([^}]+)}}/g;
        const variables = new Set<string>();
        let match;

        while ((match = variableRegex.exec(content)) !== null) {
            variables.add(match[1].trim());
        }

        return Array.from(variables);
    }

    async duplicate(id: string) {
        const template = await this.templateRepository.findOne({
            where: { id }
        });

        if (!template) {
            throw new Error('Template not found');
        }

        const newTemplate = this.templateRepository.create({
            ...template,
            id: undefined,
            name: `${template.name} (Copy)`,
            createdAt: undefined,
            updatedAt: undefined
        });

        return await this.templateRepository.save(newTemplate);
    }

    async delete(id: string) {
        const template = await this.templateRepository.findOne({
            where: { id }
        });

        if (!template) {
            throw new Error('Template not found');
        }

        await this.templateRepository.remove(template);
        return { success: true };
    }
}