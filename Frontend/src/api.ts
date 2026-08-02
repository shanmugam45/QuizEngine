function apiBase(): string {
  const raw = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '')
  if (raw) {
    return raw.endsWith('/api') ? raw : `${raw}/api`
  }
  return 'http://localhost:5000/api'
}

export const API = apiBase()
export const SOCKET_URL = API.replace(/\/api$/, '')
