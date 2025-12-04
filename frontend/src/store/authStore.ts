import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '../types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (credentials) => {
                const formData = new FormData();
                formData.append('username', credentials.username);
                formData.append('password', credentials.password);

                const response = await api.post<AuthResponse>('/auth/token', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const { access_token } = response.data;
                localStorage.setItem('token', access_token);

                set({ token: access_token, isAuthenticated: true });

                // Buscar dados do usuário
                const userResponse = await api.get<User>('/users/me');
                set({ user: userResponse.data });
            },

            register: async (data) => {
                await api.post('/auth/register', data);
            },

            logout: () => {
                localStorage.removeItem('token');
                set({ user: null, token: null, isAuthenticated: false });
            },

            fetchUser: async () => {
                try {
                    const response = await api.get<User>('/users/me');
                    set({ user: response.data, isAuthenticated: true });
                } catch (error) {
                    set({ user: null, token: null, isAuthenticated: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token }),
        }
    )
);
