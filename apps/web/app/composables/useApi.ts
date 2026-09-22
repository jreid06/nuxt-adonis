/**
 * Thin wrapper around $fetch pointed at the AdonisJS API, with the bearer
 * token (if any) attached automatically. Use this instead of raw $fetch
 * for anything hitting apps/api.
 *
 * const { data } = await useApi('/api/v1/account/profile')
 */
export function useApi<T = unknown>(path: string, opts: Parameters<typeof $fetch<T>>[1] = {}) {
  const config = useRuntimeConfig()
  const token = useAuthToken()

  return $fetch<T>(path, {
    baseURL: config.public.apiBase,
    ...opts,
    headers: {
      ...(opts.headers as Record<string, string> | undefined),
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
    },
  })
}

/**
 * The persisted access token, stored as an HTTP-only-ish (JS-readable,
 * SameSite=Lax) cookie so it survives reloads and works during SSR.
 * Swap for a proper HttpOnly cookie set by the API if you want to
 * harden this against XSS before shipping.
 */
export function useAuthToken() {
  return useCookie<string | null>('auth_token', {
    default: () => null,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  })
}
