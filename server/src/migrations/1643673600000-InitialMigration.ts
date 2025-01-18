// src/migrations/1643673600000-InitialMigration.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1643673600000 implements MigrationInterface {
    name = 'InitialMigration1643673600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Users table
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "resetPasswordToken" character varying,
                "resetPasswordExpires" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_user_email" UNIQUE ("email"),
                CONSTRAINT "PK_user" PRIMARY KEY ("id")
            )
        `);

        // Organizations table
        await queryRunner.query(`
            CREATE TABLE "organization" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "logo" character varying,
                "description" text,
                "settings" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "ownerId" uuid,
                CONSTRAINT "UQ_organization_slug" UNIQUE ("slug"),
                CONSTRAINT "PK_organization" PRIMARY KEY ("id")
            )
        `);

        // Subscribers table
        await queryRunner.query(`
            CREATE TABLE "subscriber" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "metadata" jsonb,
                "tags" text array DEFAULT '{}',
                "isActive" boolean NOT NULL DEFAULT true,
                "lastEmailSentAt" TIMESTAMP,
                "emailsSentCount" integer NOT NULL DEFAULT 0,
                "emailsOpenedCount" integer NOT NULL DEFAULT 0,
                "emailsClickedCount" integer NOT NULL DEFAULT 0,
                "subscriptionStatus" jsonb NOT NULL DEFAULT '{"subscribed": true}',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "organizationId" uuid,
                CONSTRAINT "PK_subscriber" PRIMARY KEY ("id")
            )
        `);

        // Campaigns table
        await queryRunner.query(`
            CREATE TABLE "campaign" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "subject" character varying NOT NULL,
                "content" text NOT NULL,
                "status" character varying NOT NULL DEFAULT 'draft',
                "type" character varying NOT NULL DEFAULT 'regular',
                "settings" jsonb,
                "scheduledFor" TIMESTAMP,
                "sentAt" TIMESTAMP,
                "metrics" jsonb DEFAULT '{}',
                "segmentation" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "organizationId" uuid,
                CONSTRAINT "PK_campaign" PRIMARY KEY ("id")
            )
        `);

        // Templates table
        await queryRunner.query(`
            CREATE TABLE "template" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "content" text NOT NULL,
                "description" character varying,
                "category" character varying,
                "variables" text array DEFAULT '{}',
                "previewData" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "organizationId" uuid,
                CONSTRAINT "PK_template" PRIMARY KEY ("id")
            )
        `);

        // Email Events table
        await queryRunner.query(`
            CREATE TABLE "email_event" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "campaignId" uuid NOT NULL,
                "subscriberId" uuid NOT NULL,
                "eventType" character varying NOT NULL,
                "metadata" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_email_event" PRIMARY KEY ("id")
            )
        `);

        // Add foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "organization"
            ADD CONSTRAINT "FK_organization_owner"
            FOREIGN KEY ("ownerId")
            REFERENCES "user"("id")
            ON DELETE SET NULL
        `);

        await queryRunner.query(`
            ALTER TABLE "subscriber"
            ADD CONSTRAINT "FK_subscriber_organization"
            FOREIGN KEY ("organizationId")
            REFERENCES "organization"("id")
            ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "campaign"
            ADD CONSTRAINT "FK_campaign_organization"
            FOREIGN KEY ("organizationId")
            REFERENCES "organization"("id")
            ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "template"
            ADD CONSTRAINT "FK_template_organization"
            FOREIGN KEY ("organizationId")
            REFERENCES "organization"("id")
            ON DELETE CASCADE
        `);

        // Add indexes
        await queryRunner.query(`
            CREATE INDEX "IDX_subscriber_email" ON "subscriber"("email");
            CREATE INDEX "IDX_subscriber_organization" ON "subscriber"("organizationId");
            CREATE INDEX "IDX_campaign_status" ON "campaign"("status");
            CREATE INDEX "IDX_campaign_scheduled" ON "campaign"("scheduledFor");
            CREATE INDEX "IDX_email_event_campaign" ON "email_event"("campaignId");
            CREATE INDEX "IDX_email_event_subscriber" ON "email_event"("subscriberId");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX "IDX_email_event_subscriber"`);
        await queryRunner.query(`DROP INDEX "IDX_email_event_campaign"`);
        await queryRunner.query(`DROP INDEX "IDX_campaign_scheduled"`);
        await queryRunner.query(`DROP INDEX "IDX_campaign_status"`);
        await queryRunner.query(`DROP INDEX "IDX_subscriber_organization"`);
        await queryRunner.query(`DROP INDEX "IDX_subscriber_email"`);

        // Drop foreign keys
        await queryRunner.query(`ALTER TABLE "template" DROP CONSTRAINT "FK_template_organization"`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP CONSTRAINT "FK_campaign_organization"`);
        await queryRunner.query(`ALTER TABLE "subscriber" DROP CONSTRAINT "FK_subscriber_organization"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_organization_owner"`);

        // Drop tables
        await queryRunner.query(`DROP TABLE "email_event"`);
        await queryRunner.query(`DROP TABLE "template"`);
        await queryRunner.query(`DROP TABLE "campaign"`);
        await queryRunner.query(`DROP TABLE "subscriber"`);
        await queryRunner.query(`DROP TABLE "organization"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}