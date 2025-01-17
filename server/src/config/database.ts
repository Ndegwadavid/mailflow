// src/config/database.ts
import { DataSource } from "typeorm"
import { User } from "../models/User"
import { Organization } from "../models/Organization"
import { Subscriber } from "../models/Subscriber"
import { Campaign } from "../models/Campaign"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "mailflow",
    password: process.env.DB_PASSWORD || "mailflow123",
    database: process.env.DB_NAME || "mailflow",
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
    entities: [User, Organization, Subscriber, Campaign],
    subscribers: [],
    migrations: []
});