// src/middlewares/rateLimit.ts
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const createRateLimiter = (
    prefix: string,
    maxRequests: number,
    windowMs: number
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const ip = req.ip;
        const key = `${prefix}:${ip}`;

        try {
            const current = await redis.incr(key);
            
            if (current === 1) {
                await redis.pexpire(key, windowMs);
            }

            if (current > maxRequests) {
                return res.status(429).json({
                    error: 'Too many requests, please try again later.'
                });
            }

            next();
        } catch (error) {
            // If Redis fails, allow the request
            console.error('Rate limiter error:', error);
            next();
        }
    };
}

// Rate limiters for different endpoints
export const authRateLimiter = createRateLimiter('auth', 5, 60 * 1000); // 5 requests per minute
export const resetPasswordRateLimiter = createRateLimiter('reset', 3, 60 * 1000); // 3 requests per minute