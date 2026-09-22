/**
 * Hydrates the current user from a persisted token on app start, so a
 * page refresh doesn't lose the "logged in" state.
 */
export default defineNuxtPlugin(async () => {
  const { fetchUser } = useAuth()
  await fetchUser()
})
