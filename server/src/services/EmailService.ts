import amqp from 'amqplib';
import { AppDataSource } from '../config/database';
import { Campaign } from '../models/Campaign';
import { Subscriber } from '../models/Subscriber';
import { EmailEvent, EventType } from '../models/Analytics';

export class EmailService {
    private connection: amqp.Connection | null = null;
    private channel: amqp.Channel | null = null;
    private readonly QUEUE_NAME = 'email_queue';
    private readonly DLQ_NAME = 'email_dlq';
    private readonly MAX_RETRIES = 3;

    constructor() {
        if (process.env.NODE_ENV !== 'development') {
            this.initializeQueue().catch(err => {
                console.error('Queue initialization error:', err);
            });
        }
    }

    private getRabbitMQUrl(): string {
        const user = process.env.RABBITMQ_USER || 'mailflow';
        const password = process.env.RABBITMQ_PASSWORD || 'mailflow123';
        const host = process.env.RABBITMQ_HOST || 'localhost';
        const port = process.env.RABBITMQ_PORT || '5672';
        const vhost = process.env.RABBITMQ_VHOST || '/';

        return `amqp://${user}:${password}@${host}:${port}${vhost}`;
    }

    private async initializeQueue() {
        try {
            const url = this.getRabbitMQUrl();
            console.log('Connecting to RabbitMQ at:', url.replace(/:[^:@]*@/, ':***@'));

            this.connection = await amqp.connect(url);
            this.channel = await this.connection.createChannel();

            await this.channel.assertQueue(this.QUEUE_NAME, {
                durable: true,
                arguments: {
                    'x-dead-letter-exchange': '',
                    'x-dead-letter-routing-key': this.DLQ_NAME
                }
            });

            await this.channel.assertQueue(this.DLQ_NAME, { durable: true });

            // Set up consumer
            await this.channel.consume(this.QUEUE_NAME, async (msg) => {
                if (msg) {
                    try {
                        const emailData = JSON.parse(msg.content.toString());
                        await this.processEmail(emailData);
                        this.channel?.ack(msg);
                    } catch (error) {
                        // Handle failed processing
                        console.error('Error processing email:', error);
                        this.channel?.nack(msg, false, false);
                    }
                }
            });

            console.log('RabbitMQ setup completed successfully');
        } catch (error) {
            console.error('RabbitMQ setup failed:', error);
            throw error;
        }
    }

    async queueEmail(data: {
        campaignId: string;
        subscriberId: string;
        subject: string;
        content: string;
        from: string;
    }) {
        if (process.env.NODE_ENV === 'development') {
            console.log('Development mode: Simulating email send:', data);
            return;
        }

        if (!this.channel) {
            throw new Error('Email service not initialized');
        }

        await this.channel.sendToQueue(
            this.QUEUE_NAME,
            Buffer.from(JSON.stringify(data)),
            { persistent: true }
        );
    }

    private async processEmail(emailData: any) {
        if (process.env.NODE_ENV === 'development') {
            console.log('Development mode: Processing email:', emailData);
            return;
        }

        // Here you would integrate with your email provider
        // For now, we'll just log
        console.log('Processing email:', emailData);
    }

    async close() {
        if (this.channel) {
            await this.channel.close();
        }
        if (this.connection) {
            await this.connection.close();
        }
    }
}