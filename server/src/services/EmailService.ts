// src/services/EmailService.ts
interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

export class EmailService {
    async sendEmail(options: EmailOptions): Promise<void> {
        // In development, just log the email
        console.log('========= EMAIL SENDING SIMULATION =========');
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        console.log('Content:', options.html);
        console.log('=========================================');
        
        // Simulate email sending delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return Promise.resolve();
    }

    async sendPasswordReset(email: string, resetToken: string): Promise<void> {
        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
        
        await this.sendEmail({
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h1>Password Reset Request</h1>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>If you didn't request this, please ignore this email.</p>
            `
        });
    }

    async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
        await this.sendEmail({
            to: email,
            subject: 'Welcome to MailFlow!',
            html: `
                <h1>Welcome to MailFlow, ${firstName}!</h1>
                <p>We're excited to have you on board.</p>
                <p>During the development phase, this is a simulated email.</p>
            `
        });
    }
}