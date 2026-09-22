<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-semibold tracking-tight">Dashboard</h1>
    <div class="rounded-lg border border-neutral-200 bg-white p-4 text-sm">
      <p><span class="text-neutral-500">Email:</span> {{ user?.email }}</p>
      <p v-if="user?.fullName"><span class="text-neutral-500">Name:</span> {{ user.fullName }}</p>
      <p>
        <span class="text-neutral-500">Member since:</span>
        {{ user ? new Date(user.createdAt).toLocaleDateString() : '' }}
      </p>
    </div>
    <p class="text-sm text-neutral-500">
      This page is behind <code>middleware: 'auth'</code> — replace it with your product's real
      home screen.
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { user } = useAuth()
</script>
