import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { errorHandler } from './errorHandler';
import type {
  UserData,
  ScoutData,
  User,
  PresenceList,
  LoginResponse,
} from './scoutApi.types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const scoutApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      });
      if (data.access_token) {
        localStorage.setItem('authToken', data.access_token);
      }
      return data;
    } catch (error) {
      throw new Error(errorHandler(error as AxiosError));
    }
  },

  registerUser: async (userData: UserData): Promise<User> => {
    try {
      const { data } = await api.post<User>('/auth/cadastro', userData);
      return data;
    } catch (error) {
      throw new Error(errorHandler(error as AxiosError));
    }
  },

  registerScout: async (scoutData: ScoutData): Promise<ScoutData> => {
    try {
      const { data } = await api.post<ScoutData>(
        '/escoteiros/cadastro',
        scoutData
      );
      return data;
    } catch (error) {
      throw new Error(errorHandler(error as AxiosError));
    }
  },

  getScouts: async (): Promise<ScoutData[]> => {
    try {
      const { data } = await api.get<ScoutData[]>('/escoteiros');
      return data;
    } catch (error) {
      throw new Error(errorHandler(error as AxiosError));
    }
  },

  getLists: async (id?: number): Promise<PresenceList | PresenceList[]> => {
    try {
      const url = id ? `/listas/${id}` : '/listas';
      const { data } = await api.get<PresenceList | PresenceList[]>(url);
      return data;
    } catch (error) {
      throw new Error(errorHandler(error as AxiosError));
    }
  },

  confirmList: async (listData: number[]): Promise<{ message: string }> => {
    try {
      const { data } = await api.post<{ message: string }>(
        '/listas/confirmar',
        listData
      );
      return data;
    } catch (error) {
      throw new Error(errorHandler(error as AxiosError));
    }
  },

  getUserData: async (): Promise<User> => {
    try {
      const { data } = await api.get<User>('/auth/userData');
      return data;
    } catch (error) {
      throw new Error(errorHandler(error as AxiosError));
    }
  },

  requestPreAuthCode: async (email: string): Promise<{ message: string }> => {
    try {
      const { data } = await api.post<{ message: string }>(
        '/access-code/request',
        { email }
      );
      return data;
    } catch (error) {
      throw new Error(errorHandler(error as AxiosError));
    }
  },

  verifyPreAuthCode: async (code: string): Promise<{ success: boolean }> => {
    try {
      const { data } = await api.post<{ success: boolean }>(
        '/access-code/verify',
        { code }
      );
      return data;
    } catch (error) {
      throw new Error(errorHandler(error as AxiosError));
    }
  },
};

export default scoutApi;
