
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Repository, MoreThan } from 'typeorm';
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

    async requestPasswordReset(email: string): Promise<{ message: string }> {
        try {
            const user = await this.userRepository.findOne({ where: { email } });
            
            if (user) {
                // Generate reset token
                const resetToken = crypto.randomBytes(32).toString('hex');
                const hashedToken = await bcrypt.hash(resetToken, 10);

                // Save reset token and expiry
                user.resetPasswordToken = hashedToken;
                user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
                await this.userRepository.save(user);

                // Send reset email
                await this.emailService.sendPasswordReset(email, resetToken);
            }

            // Always return success for security
            return { 
                message: "If an account exists with that email, you will receive password reset instructions." 
            };
        } catch (error) {
            throw error;
        }
    }

    async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
        try {
            const user = await this.userRepository.findOne({
                where: { 
                    resetPasswordToken: token,
                    resetPasswordExpires: MoreThan(new Date())
                }
            });

            if (!user) {
                throw new Error('Invalid or expired reset token');
            }

            // Update password
            user.password = await bcrypt.hash(newPassword, 10);
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await this.userRepository.save(user);

            // Send confirmation email
            await this.emailService.sendPasswordResetConfirmation(user.email);

            return { message: "Password has been reset successfully" };
        } catch (error) {
            throw error;
        }
    }

    async changePassword(
        userId: string, 
        currentPassword: string, 
        newPassword: string
    ): Promise<{ message: string }> {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            
            if (!user) {
                throw new Error('User not found');
            }

            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            if (!isValidPassword) {
                throw new Error('Current password is incorrect');
            }

            user.password = await bcrypt.hash(newPassword, 10);
            await this.userRepository.save(user);

            return { message: "Password changed successfully" };
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