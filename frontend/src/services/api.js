const TOKEN_KEY = 'synapse_tokens'

export class ApiError extends Error {
  constructor(status, detail) {
    super(typeof detail === 'string' ? detail : 'Request failed')
    this.status = status
    this.detail = detail
  }
}

export function saveTokens(tokens) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens))
}

export function getTokens() {
  try {
    return JSON.parse(localStorage.getItem(TOKEN_KEY)) ?? null
  } catch {
    return null
  }
}

export function getAccessToken() {
  return getTokens()?.access_token ?? null
}

export function getRefreshToken() {
  return getTokens()?.refresh_token ?? null
}

export function getUser() {
  return getTokens()?.user ?? null
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated() {
  return Boolean(getAccessToken())
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new Error('No refresh token')
  const response = await fetch('/api/v1/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
  if (!response.ok) {
    clearTokens()
    throw new Error('Session expired')
  }
  const data = await response.json()
  saveTokens({ ...getTokens(), access_token: data.access_token })
  return data.access_token
}

export async function apiRequest(path, { method = 'GET', body, formData } = {}) {
  const headers = {}
  const accessToken = getAccessToken()
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`

  let payload
  if (formData) {
    payload = formData
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  let response = await fetch(`/api/v1${path}`, { method, headers, body: payload })

  if (response.status === 401 && accessToken) {
    try {
      const newToken = await refreshAccessToken()
      headers.Authorization = `Bearer ${newToken}`
      response = await fetch(`/api/v1${path}`, { method, headers, body: payload })
    } catch {
      // session expired; fall through to the error below
    }
  }

  const text = await response.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!response.ok) {
    const detail = data?.detail
    const message = Array.isArray(detail)
      ? 'Please check the submitted details.'
      : (detail ?? 'Request failed')
    throw new ApiError(response.status, message)
  }
  return data
}
