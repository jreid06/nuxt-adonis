<template>
  <div class="max-w-sm space-y-6">
    <h1 class="text-2xl font-semibold tracking-tight">Create an account</h1>

    <form class="space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="block text-sm font-medium text-neutral-700">Full name</label>
        <input v-model="form.fullName" type="text" class="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label class="block text-sm font-medium text-neutral-700">Email</label>
        <input v-model="form.email" type="email" required class="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label class="block text-sm font-medium text-neutral-700">Password</label>
        <input v-model="form.password" type="password" required minlength="8" class="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label class="block text-sm font-medium text-neutral-700">Confirm password</label>
        <input v-model="form.passwordConfirmation" type="password" required minlength="8" class="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm" />
      </div>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-neutral-700 disabled:opacity-50"
      >
        {{ loading ? 'Creating account…' : 'Sign up' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const { signup } = useAuth()
const router = useRouter()

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
})
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  loading.value = true
  error.value = ''
  try {
    await signup({ ...form, fullName: form.fullName || null })
    await router.push('/dashboard')
  } catch (err: any) {
    error.value = err?.data?.message ?? 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
