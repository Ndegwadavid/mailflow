import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Subscriber } from "./Subscriber";
import { Campaign } from "./Campaign";

@Entity()
export class Organization {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    slug: string;

    @Column({ nullable: true })
    logo: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(() => User, user => user.organizations)
    owner: User;

    @OneToMany(() => Subscriber, subscriber => subscriber.organization)
    subscribers: Subscriber[];

    @OneToMany(() => Campaign, campaign => campaign.organization)
    campaigns: Campaign[];

    @Column({ type: 'jsonb', nullable: true })
    settings: {
        emailCustomization?: {
            fromName?: string;
            fromEmail?: string;
        };
        brandColors?: {
            primary?: string;
            secondary?: string;
        };
    };

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}