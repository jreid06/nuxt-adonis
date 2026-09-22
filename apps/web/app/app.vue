<template>
  <div class="min-h-screen bg-neutral-50 text-neutral-900">
    <header class="border-b border-neutral-200 bg-white">
      <nav class="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <NuxtLink to="/" class="font-semibold tracking-tight">scaffold</NuxtLink>
        <div class="flex items-center gap-4 text-sm">
          <template v-if="user">
            <NuxtLink to="/dashboard" class="hover:underline">Dashboard</NuxtLink>
            <button class="text-neutral-500 hover:text-neutral-900" @click="logout">
              Log out
            </button>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="hover:underline">Log in</NuxtLink>
            <NuxtLink
              to="/signup"
              class="rounded-md bg-neutral-900 px-3 py-1.5 text-white hover:bg-neutral-700"
            >
              Sign up
            </NuxtLink>
          </template>
        </div>
      </nav>
    </header>

    <main class="mx-auto max-w-3xl px-6 py-10">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
</script>
