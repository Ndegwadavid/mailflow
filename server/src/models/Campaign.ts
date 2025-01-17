
// src/models/Campaign.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Organization } from "./Organization";

@Entity()
export class Campaign {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    subject: string;

    @Column('text')
    content: string;

    @Column({
        type: "enum",
        enum: ["draft", "scheduled", "sending", "sent", "failed"]
    })
    status: string;

    @Column({ nullable: true })
    scheduledFor: Date;

    @ManyToOne(() => Organization, org => org.campaigns)
    organization: Organization;

    @Column({ type: 'jsonb', nullable: true })
    metadata: {
        opens?: number;
        clicks?: number;
        bounces?: number;
    };

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}