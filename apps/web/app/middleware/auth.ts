/**
 * Route middleware for pages that require a signed-in user.
 * Usage: definePageMeta({ middleware: 'auth' })
 */
export default defineNuxtRouteMiddleware(async () => {
  const { user, fetchUser } = useAuth()

  if (!user.value) {
    await fetchUser()
  }

  if (!user.value) {
    return navigateTo('/login')
  }
})
