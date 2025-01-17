import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import authRoutes from './routes/auth';
import organizationRoutes from './routes/organization';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

const startServer = async () => {
    try {
        // Initialize database
        await AppDataSource.initialize();
        console.log("Database has been initialized!");

        // Routes (only initialize after database connection)
        app.use('/api/auth', authRoutes);
        app.use('/api/organizations', organizationRoutes);

        // Start server
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error during initialization:", error);
        process.exit(1);
    }
};

startServer();