interface User {
  id: string
  fullName: string | null
  email: string
  createdAt: string
  updatedAt: string
}

interface AuthResponse {
  data: { user: User; token: string }
}

/**
 * Talks to the auth endpoints on the AdonisJS API and keeps the current
 * user in shared state. Call `fetchUser()` once (e.g. in a plugin or
 * app.vue) to hydrate `user` from a persisted token on page load.
 */
export function useAuth() {
  const user = useState<User | null>('auth_user', () => null)
  const token = useAuthToken()

  async function signup(payload: {
    fullName: string | null
    email: string
    password: string
    passwordConfirmation: string
  }) {
    const res = await useApi<AuthResponse>('/api/v1/auth/signup', {
      method: 'POST',
      body: payload,
    })
    token.value = res.data.token
    user.value = res.data.user
    return res.data.user
  }

  async function login(payload: { email: string; password: string }) {
    const res = await useApi<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: payload,
    })
    token.value = res.data.token
    user.value = res.data.user
    return res.data.user
  }

  async function logout() {
    if (token.value) {
      await useApi('/api/v1/account/logout', { method: 'POST' }).catch(() => {})
    }
    token.value = null
    user.value = null
  }

  async function fetchUser() {
    if (!token.value) {
      user.value = null
      return null
    }
    try {
      const res = await useApi<{ data: User }>('/api/v1/account/profile')
      user.value = res.data
      return res.data
    } catch {
      token.value = null
      user.value = null
      return null
    }
  }

  return { user, signup, login, logout, fetchUser }
}
