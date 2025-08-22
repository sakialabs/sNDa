import { API_CONFIG } from "./config"

function buildAuthHeaders(initHeaders?: HeadersInit) {
  const headers = new Headers(initHeaders)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN)
    if (token) headers.set("Authorization", `Bearer ${token}`)
  }
  return headers
}

export async function authFetch(path: string, init: RequestInit = {}) {
  const headers = buildAuthHeaders(init.headers)
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json")

  const response = await fetch(`${API_CONFIG.BASE_URL}${path}`, {
    ...init,
    headers,
  })

  if (!response.ok) {
    let message = response.statusText
    try {
      const data = await response.json()
      if (data && typeof data === "object" && "detail" in data) {
        message = (data as { detail?: string }).detail || message
      }
    } catch {
      try {
        message = await response.text()
      } catch {}
    }
    throw new Error(message)
  }

  return response
}

export async function authUpload(path: string, formData: FormData) {
  const headers = buildAuthHeaders()

  const response = await fetch(`${API_CONFIG.BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: formData,
  })

  if (!response.ok) {
    let message = response.statusText
    try {
      const data = await response.json()
      if (data && typeof data === "object" && "detail" in data) {
        message = (data as { detail?: string }).detail || message
      }
    } catch {}
    throw new Error(message)
  }

  return response
}


