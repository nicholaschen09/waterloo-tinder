import { User, Profile, Match } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Type definitions
export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData extends LoginData {
    name: string;
    age: number;
    gender: string;
    bio?: string;
    program?: string;
    graduation_year?: number;
    interests?: string;
}

export interface LoginResponse {
    message: string;
    user_id: string;
    access_token: string;
    is_verified: boolean;
    is_waterloo: boolean;
}

export interface UpdateProfileData {
    name?: string;
    age?: number;
    gender?: string;
    bio?: string;
    program?: string;
    graduation_year?: number;
    interests?: string;
    photos?: string[];
    latitude?: number;
    longitude?: number;
}

// Helper function to get stored token
export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

// Helper function to safely access localStorage
export const safeLocalStorage = {
    getItem: (key: string): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(key);
        }
        return null;
    },
    setItem: (key: string, value: string): void => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, value);
        }
    },
    removeItem: (key: string): void => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(key);
        }
    }
};

// Authentication APIs
export const login = async (data: LoginData): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
    }

    const responseData = await response.json();

    // Store token in localStorage
    if (responseData.access_token) {
        safeLocalStorage.setItem('token', responseData.access_token);
        safeLocalStorage.setItem('user_id', responseData.user_id);
    }

    return responseData;
};

export const register = async (data: RegisterData): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
    }

    const responseData = await response.json();

    // Store token in localStorage
    if (responseData.access_token) {
        safeLocalStorage.setItem('token', responseData.access_token);
        safeLocalStorage.setItem('user_id', responseData.user_id);
    }

    return responseData;
};

export const logout = (): void => {
    safeLocalStorage.removeItem('token');
    safeLocalStorage.removeItem('user_id');
};

// User Profile APIs
export const getProfile = async (): Promise<User> => {
    const token = getToken();

    if (!token) {
        throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/users/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile');
    }

    return response.json();
};

export const updateProfile = async (data: UpdateProfileData): Promise<{ message: string }> => {
    const token = getToken();

    if (!token) {
        throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
    }

    return response.json();
};

// Match APIs
export interface MatchFilters {
    max_distance?: number;
    min_age?: number;
    max_age?: number;
    gender?: string;
    limit?: number;
}

export const getPotentialMatches = async (filters?: MatchFilters): Promise<{ matches: Match[], count: number }> => {
    const token = getToken();

    if (!token) {
        throw new Error('Not authenticated');
    }

    // Construct query string from filters
    const queryParams = filters
        ? Object.entries(filters)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => `${key}=${value}`)
            .join('&')
        : '';

    const url = `${API_URL}/matches/potential${queryParams ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch potential matches');
    }

    return response.json();
};

export const createMatch = async (targetUserId: string): Promise<{ message: string, status: string }> => {
    const token = getToken();

    if (!token) {
        throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/matches/${targetUserId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create match');
    }

    return response.json();
}; 