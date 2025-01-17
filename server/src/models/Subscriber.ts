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

@Entity()
export class Subscriber {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Index()
    @Column()
    email: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'jsonb', nullable: true })
    metadata: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        address?: string;
        customFields?: Record<string, any>;
    };

    @Column({ type: 'jsonb', default: [] })
    tags: string[];

    @Column({ type: 'timestamp', nullable: true })
    lastEmailSentAt: Date;

    @Column({ default: 0 })
    emailsSentCount: number;

    @Column({ default: 0 })
    emailsOpenedCount: number;

    @Column({ default: 0 })
    emailsClickedCount: number;

    @ManyToOne(() => Organization, organization => organization.subscribers)
    organization: Organization;

    @Column({ type: 'jsonb', default: { subscribed: true } })
    subscriptionStatus: {
        subscribed: boolean;
        unsubscribedAt?: Date;
        unsubscribeReason?: string;
    };

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}