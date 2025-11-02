import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api, apiService } from '@/services/apiService';

interface User {
  id: string;
  email: string;
  role: string;
  full_name?: string;
}

export const useAuthStore = defineStore('auth', () => {
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
    // Navigate to login - will be handled by the component using this store
    window.location.href = '/login';
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

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Call refresh endpoint - use the correct API structure
      const response = await apiService.adminRefreshToken({ refresh_token: refreshToken });

      if (response.success && response.data?.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        return { success: true };
      }
      throw new Error('Token refresh failed');
    } catch (err: any) {
      console.error('Token refresh error:', err);
      logout();
      return { success: false, error: err.message };
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    initialize,
    refreshToken
  };
});
