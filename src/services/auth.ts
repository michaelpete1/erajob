import apiClient from './apiClient'
import type { LoginCredentials, SignupData } from '../types/api/auth'

export const login = (credentials: LoginCredentials) => {
  return apiClient.post('/users/login', credentials)
}

export const signup = (data: SignupData) => {
  return apiClient.post('/users/signup', data)
}

export const getUser = () => {
  return apiClient.get('/users/me')
}
