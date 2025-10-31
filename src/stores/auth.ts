import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/services/apiService';

interface User {
  id: string;
  email: string;
  role: string;
  full_name?: string;
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const login = async (credentials: { email: string; password: string; role: string }) => {
    try {
      loading.value = true;
      error.value = null;

      let response;
      if (credentials.role === 'agent') {
        response = await api.agent.login(credentials);
      } else if (credentials.role === 'admin') {
        response = await api.admin.login(credentials);
      } else {
        response = await api.client.login(credentials);
      }

      if (response.data?.access_token) {
        user.value = {
          id: response.data.id || '',
          email: response.data.email || credentials.email,
          role: credentials.role,
          full_name: response.data.full_name
        };
        isAuthenticated.value = true;
        localStorage.setItem('access_token', response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        localStorage.setItem('userRole', credentials.role);
        localStorage.setItem('userInfo', JSON.stringify(user.value));
        return { success: true };
      }
      throw new Error('Authentication failed');
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Login failed';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userInfo');
    router.push('/login');
  };

  const initialize = () => {
    const token = localStorage.getItem('access_token');
    const userInfo = localStorage.getItem('userInfo');
    if (token && userInfo) {
      try {
        user.value = JSON.parse(userInfo);
        isAuthenticated.value = true;
      } catch (e) {
        console.error('Failed to parse user info', e);
        logout();
      }
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    initialize
  };
});
