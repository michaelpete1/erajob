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
      const role = (localStorage.getItem('userRole') || '').toLowerCase()
      console.debug('refreshToken: start', { role, hasRefreshToken: Boolean(refreshToken) })
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Use role-aware refresh: admin uses admin refresh; others use generic users refresh
      let response
      if (role === 'admin') {
        console.debug('refreshToken: calling adminRefreshToken')
        response = await apiService.adminRefreshToken({ refresh_token: refreshToken })
        console.debug('refreshToken: adminRefreshToken returned', response)
      } else {
        // Use the proxied apiClient to call /v1/users/refresh so the dev proxy handles CORS
        try {
          const { apiClient } = await import('@/services/apiService')
          console.debug('refreshToken: calling proxied /v1/users/refresh')
          const resp = await apiClient.post('/v1/users/refresh', { refresh_token: refreshToken })
          // Normalize to the legacy response shape
          response = { success: true, data: resp.data }
          console.debug('refreshToken: proxied refresh returned', response)
        } catch (proxyErr: any) {
          console.error('refreshToken: proxied refresh failed', proxyErr)
          // Hint for developers: possible CORS/proxy/server issue
          const networkMsg = proxyErr?.message || ''
          if (/cors|network|ERR_FAILED/i.test(networkMsg) || proxyErr?.response?.status === 500) {
            console.warn('Possible CORS or server error on refresh endpoint. Ensure dev proxy (VITE_API_BASE_URL=/api) is active or that server CORS allows localhost.')
          }
          throw proxyErr
        }
      }

      if (response && response.success) {
        // On success, ensure tokens are persisted (some endpoints return tokens differently)
        const data = response.data?.data || response.data || response
        const newAccess = data?.access_token || data?.data?.access_token
        const newRefresh = data?.refresh_token || data?.data?.refresh_token
        console.debug('refreshToken: parsed tokens', { newAccess: Boolean(newAccess), newRefresh: Boolean(newRefresh) })
        if (newAccess) {
          localStorage.setItem('access_token', newAccess)
        }
        if (newRefresh) {
          localStorage.setItem('refresh_token', newRefresh)
        }
        return { success: true }
      }

      // If response not successful, bail out without forcing a logout here.
      console.error('Token refresh failure response:', response)
      try { localStorage.setItem('refresh_failed_at', String(Date.now())) } catch {}
      return { success: false, error: (response && (response.error || response.message)) || 'Token refresh failed' }
    } catch (err: any) {
      console.error('Token refresh error:', err);
      try { localStorage.setItem('refresh_failed_at', String(Date.now())) } catch {}
      // Do NOT call logout here; let higher-level flows or the API interceptor decide when to perform logout.
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
