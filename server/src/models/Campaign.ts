import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    Index
} from "typeorm";
import { Organization } from "./Organization";

export enum CampaignStatus {
    DRAFT = 'draft',
    SCHEDULED = 'scheduled',
    SENDING = 'sending',
    SENT = 'sent',
    PAUSED = 'paused',
    CANCELLED = 'cancelled'
}

export enum CampaignType {
    REGULAR = 'regular',
    AUTOMATED = 'automated',
    AB_TEST = 'ab_test'
}

@Entity()
export class Campaign {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @Index()
    name: string;

    @Column()
    subject: string;

    @Column({ type: 'text' })
    content: string;

    @Column({
        type: 'enum',
        enum: CampaignStatus,
        default: CampaignStatus.DRAFT
    })
    status: CampaignStatus;

    @Column({
        type: 'enum',
        enum: CampaignType,
        default: CampaignType.REGULAR
    })
    type: CampaignType;

    @Column({ type: 'jsonb', nullable: true })
    settings: {
        fromName?: string;
        fromEmail?: string;
        replyTo?: string;
        trackOpens?: boolean;
        trackClicks?: boolean;
    };

    @Column({ type: 'timestamp', nullable: true })
    scheduledFor: Date;

    @Column({ type: 'timestamp', nullable: true })
    sentAt: Date;

    @Column({ type: 'jsonb', default: {} })
    metrics: {
        totalRecipients?: number;
        sent?: number;
        delivered?: number;
        opened?: number;
        clicked?: number;
        bounced?: number;
        complained?: number;
        unsubscribed?: number;
    };

    @Column({ type: 'jsonb', nullable: true })
    segmentation: {
        rules?: any[];
        includedTags?: string[];
        excludedTags?: string[];
    };

    @ManyToOne(() => Organization, organization => organization.campaigns)
    organization: Organization;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}