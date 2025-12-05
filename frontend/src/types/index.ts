export interface User {
    id: number;
    email: string;
    username: string;
    is_superuser: boolean;
}

export interface Project {
    id: number;
    name: string;
    description?: string;
    owner_id: number;
    created_at: string;
    updated_at?: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    email: string;
    username: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}
