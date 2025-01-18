// src/utils/validation.ts

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
};

export const validateSubscriberData = (data: any): { isValid: boolean; error?: string } => {
    if (!data.email || !validateEmail(data.email)) {
        return {
            isValid: false,
            error: 'Valid email is required'
        };
    }

    return { isValid: true };
};

export const validateOrganizationName = (name: string): boolean => {
    return name.length >= 2 && name.length <= 100;
};

export const validateTags = (tags: string[]): boolean => {
    return Array.isArray(tags) && tags.every(tag => 
        typeof tag === 'string' && tag.length > 0 && tag.length <= 50
    );
};

export const validateMetadata = (metadata: any): boolean => {
    if (typeof metadata !== 'object' || metadata === null) {
        return false;
    }

    // Check if all values are strings, numbers, or booleans
    return Object.values(metadata).every(value => 
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
    );
};