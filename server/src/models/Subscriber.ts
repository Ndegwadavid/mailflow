
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Organization } from "./Organization";

@Entity()
export class Subscriber {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    email: string;

    @Column({ type: 'jsonb', default: {} })
    metadata: Record<string, any>;

    @ManyToOne(() => Organization, org => org.subscribers)
    organization: Organization;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
