<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold tracking-tight">Nuxt 4 + AdonisJS scaffold</h1>
    <p class="text-neutral-600">
      This page is proof the stack is wired end-to-end: Nuxt talks to the AdonisJS API over
      <code class="rounded bg-neutral-100 px-1 py-0.5 text-sm">{{ apiBase }}</code>, which reads
      and writes Postgres through Drizzle.
    </p>

    <div class="rounded-lg border border-neutral-200 bg-white p-4">
      <p class="text-sm font-medium text-neutral-500">API status</p>
      <p class="mt-1 font-mono text-sm" :class="statusColor">{{ status }}</p>
    </div>

    <p class="text-sm text-neutral-500">
      See <code>README.md</code> at the repo root for how to run both apps and swap in your own
      pages, tables, and Stripe products.
    </p>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const apiBase = config.public.apiBase

const status = ref('checking…')
const statusColor = ref('text-neutral-400')

onMounted(async () => {
  try {
    await $fetch(apiBase)
    status.value = 'API reachable ✓'
    statusColor.value = 'text-green-600'
  } catch {
    status.value = `API not reachable at ${apiBase} — is \`pnpm dev\` running in apps/api?`
    statusColor.value = 'text-red-600'
  }
})
</script>
