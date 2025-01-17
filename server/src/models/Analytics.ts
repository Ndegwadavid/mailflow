import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    Index
} from "typeorm";
import { Campaign } from "./Campaign";
import { Subscriber } from "./Subscriber";

export enum EventType {
    SENT = 'sent',
    DELIVERED = 'delivered',
    OPENED = 'opened',
    CLICKED = 'clicked',
    BOUNCED = 'bounced',
    COMPLAINED = 'complained',
    UNSUBSCRIBED = 'unsubscribed'
}

@Entity()
@Index(['campaignId', 'subscriberId', 'eventType'])
export class EmailEvent {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    campaignId: string;

    @Column()
    subscriberId: string;

    @Column({
        type: 'enum',
        enum: EventType
    })
    eventType: EventType;

    @Column({ type: 'jsonb', nullable: true })
    metadata: {
        userAgent?: string;
        ipAddress?: string;
        location?: string;
        linkUrl?: string;
        bounceType?: string;
        bounceReason?: string;
        unsubscribeReason?: string;
    };

    @ManyToOne(() => Campaign)
    campaign: Campaign;

    @ManyToOne(() => Subscriber)
    subscriber: Subscriber;

    @CreateDateColumn()
    createdAt: Date;
}

@Entity()
export class DailyStats {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @Index()
    date: Date;

    @Column()
    organizationId: string;

    @Column({ type: 'jsonb' })
    metrics: {
        sent: number;
        delivered: number;
        opened: number;
        clicked: number;
        bounced: number;
        complained: number;
        unsubscribed: number;
        deliveryRate: number;
        openRate: number;
        clickRate: number;
    };

    @CreateDateColumn()
    createdAt: Date;
}