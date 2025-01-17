import { Request, Response, NextFunction } from 'express';

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
};

export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || firstName.length < 2) {
        return res.status(400).json({ error: 'First name is required and must be at least 2 characters' });
    }

    if (!lastName || lastName.length < 2) {
        return res.status(400).json({ error: 'Last name is required and must be at least 2 characters' });
    }

    if (!email || !validateEmail(email)) {
        return res.status(400).json({ error: 'Valid email is required' });
    }

    if (!password || !validatePassword(password)) {
        return res.status(400).json({ 
            error: 'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number' 
        });
    }

    next();
};