<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { registerSchema } from '../schemas/register.schema'
import api from '../api/axios'

const router = useRouter()

const email = ref('')
const password = ref('')
const name = ref('')

const loading = ref(false)

const errors = ref<{
  email?: string
  password?: string
  name?: string
  general?: string
}>({})

function validate() {

  const result = registerSchema.safeParse({
    email: email.value,
    password: password.value,
    name: name.value
  })

  errors.value = {}

  if (!result.success) {

    result.error.issues.forEach(issue => {

      const key = issue.path?.[0]

      if (typeof key === 'string') {
        errors.value[key as 'email' | 'password' | 'name'] = issue.message
      }

    })

    return false
  }

  return true
}

watch([email, password, name], () => {
  validate()
})

async function submit() {

  if (!validate()) return

  try {

    loading.value = true

    await api.post('/auth/register', {
      email: email.value,
      password: password.value,
      name: name.value
    })

    router.push('/login')

  } catch (e: any) {

    errors.value.general =
      e?.response?.data?.message ||
      'Registration failed'

  } finally {
    loading.value = false
  }

}
</script>

<template>

<div class="auth">

  <h1>Create account</h1>

  <p v-if="errors.general" class="error">
    {{ errors.general }}
  </p>

  <input
    v-model="email"
    type="email"
    placeholder="Email"
  >
  <p class="error">{{ errors.email }}</p>

  <input
    v-model="password"
    type="password"
    placeholder="Password"
  >
  <p class="error">{{ errors.password }}</p>

  <input
    v-model="name"
    placeholder="Name"
  >
  <p class="error">{{ errors.name }}</p>

  <button
    :disabled="loading"
    @click="submit"
  >
    {{ loading ? 'Creating account...' : 'Register' }}
  </button>

  <p class="login-link">
    Already have account?
    <router-link to="/login">
      Login
    </router-link>
  </p>

</div>

</template>

<style scoped>

.auth {

  max-width: 420px;
  margin: 100px auto;

  display: flex;
  flex-direction: column;
  gap: 6px;

}

input {

  padding: 10px;

  border-radius: 8px;

  border: 1px solid #ddd;

}

button {

  margin-top: 10px;

  padding: 12px;

  border: none;

  background: #3b82f6;

  color: white;

  border-radius: 8px;

  cursor: pointer;

  font-weight: 600;

}

button:hover {

  background: #2563eb;

}

button:disabled {

  opacity: .6;

}

.error {

  font-size: 12px;

  color: red;

  min-height: 14px;

}

.login-link {

  margin-top: 10px;

}

</style>