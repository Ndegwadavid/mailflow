// src/config/seeder.ts
import { AppDataSource } from './database';
import { User } from '../models/User';
import { Organization } from '../models/Organization';
import { Template } from '../models/Template';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
    try {
        // Create admin user
        const userRepository = AppDataSource.getRepository(User);
        const adminUser = userRepository.create({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@mailflow.com',
            password: await bcrypt.hash('admin123', 10)
        });
        await userRepository.save(adminUser);

        // Create default organization
        const orgRepository = AppDataSource.getRepository(Organization);
        const defaultOrg = orgRepository.create({
            name: 'Default Organization',
            slug: 'default-org',
            owner: adminUser,
            settings: {
                emailCustomization: {
                    fromName: 'Default Organization',
                    fromEmail: 'noreply@default-org.mailflow.com'
                },
                brandColors: {
                    primary: '#007bff',
                    secondary: '#6c757d'
                }
            }
        });
        await orgRepository.save(defaultOrg);

        // Create default templates
        const templateRepository = AppDataSource.getRepository(Template);
        const templates = [
            {
                name: 'Welcome Email',
                content: `
                    <h1>Welcome {{firstName}}!</h1>
                    <p>We're excited to have you on board.</p>
                    <p>Best regards,<br>{{organizationName}}</p>
                `,
                category: 'Onboarding',
                description: 'Default welcome email template',
                variables: ['firstName', 'organizationName'],
                organization: defaultOrg
            },
            {
                name: 'Newsletter Template',
                content: `
                    <h1>{{newsletterTitle}}</h1>
                    <div>{{content}}</div>
                    <p>Thanks for reading!</p>
                    <p>{{organizationName}}</p>
                `,
                category: 'Newsletter',
                description: 'Basic newsletter template',
                variables: ['newsletterTitle', 'content', 'organizationName'],
                organization: defaultOrg
            }
        ];

        await templateRepository.save(templates);

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
}