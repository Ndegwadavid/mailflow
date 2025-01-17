// src/services/AuthService.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { EmailService } from './EmailService';

export class AuthService {
    private emailService: EmailService;
    private userRepository: Repository<User>;

    constructor() {
        this.emailService = new EmailService();
        this.userRepository = AppDataSource.getRepository(User);
    }

    async register(userData: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }) {
        try {
            const existingUser = await this.userRepository.findOne({
                where: { email: userData.email }
            });

            if (existingUser) {
                throw new Error('User already exists');
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const user = this.userRepository.create({
                ...userData,
                password: hashedPassword
            });

            await this.userRepository.save(user);
            await this.emailService.sendWelcomeEmail(user.email, user.firstName);

            const token = this.generateToken(user);
            const { password, ...userWithoutPassword } = user;

            return { user: userWithoutPassword, token };
        } catch (error) {
            throw error;
        }
    }

    async login(email: string, password: string) {
        try {
            const user = await this.userRepository.findOne({
                where: { email }
            });

            if (!user) {
                throw new Error('Invalid credentials');
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                throw new Error('Invalid credentials');
            }

            const token = this.generateToken(user);
            const { password: _, ...userWithoutPassword } = user;

            return { user: userWithoutPassword, token };
        } catch (error) {
            throw error;
        }
    }

    private generateToken(user: User): string {
        return jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || '1234567890',
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );
    }
}