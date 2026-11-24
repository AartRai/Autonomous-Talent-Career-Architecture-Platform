import { apiRequest, clearTokens, isAuthenticated, saveTokens } from './api'

export async function signup({ email, password, fullName, role }) {
  const data = await apiRequest('/auth/signup', {
    method: 'POST',
    body: { email, password, full_name: fullName, role },
  })
  saveTokens(data)
  return data.user
}

export async function login({ email, password, rememberMe = false }) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password, remember_me: rememberMe },
  })
  saveTokens(data)
  return data.user
}

export async function fetchMe() {
  return apiRequest('/auth/me')
}

export function logout() {
  clearTokens()
}

export function isLoggedIn() {
  return isAuthenticated()
}
