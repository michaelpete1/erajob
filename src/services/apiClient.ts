import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://eba-jobs.getxoxo.space', // Removed the /api prefix
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient
