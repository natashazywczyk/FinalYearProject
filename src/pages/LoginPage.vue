<template>
  <div class="flex flex-center bg-grey-2" style="min-height: 100vh;">
    <q-card class="login-card q-pa-md">
      <q-card-section class="text-center">
        <div class="text-h4 q-mb-md">
          <q-icon name="no_smoking" size="lg" color="primary" />
          CraveControl
        </div>
        <div class="text-subtitle1 text-grey-7">
          Login to track your vaping cessation journey
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleLogin" class="q-gutter-md">
          <q-input
            v-model="email"
            type="email"
            label="Email"
            outlined
            :rules="[val => !!val || 'Email is required', val => /.+@.+\..+/.test(val) || 'Invalid email']"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            :type="isPwd ? 'password' : 'text'"
            label="Password"
            outlined
            :rules="[val => !!val || 'Password is required']"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div class="q-mt-md">
            <q-btn
              label="Login"
              type="submit"
              color="primary"
              class="full-width"
              :loading="loading"
            />
          </div>

          <div class="q-mt-md text-center">
            <q-btn
              label="Sign Up"
              flat
              color="primary"
              @click="handleSignup"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../boot/supabase'
import { Notify } from 'quasar'

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const isPwd = ref(true)
    const loading = ref(false)

    const handleLogin = async () => {
      loading.value = true
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.value,
          password: password.value
        })

        if (error) throw error

        Notify.create({
          type: 'positive',
          message: 'Login successful!'
        })

        router.push('/')
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: error.message || 'Login failed'
        })
      } finally {
        loading.value = false
      }
    }

    const handleSignup = async () => {
      loading.value = true
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.value,
          password: password.value
        })

        if (error) throw error

        Notify.create({
          type: 'positive',
          message: 'Sign up successful! Please check your email for verification.'
        })
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: error.message || 'Sign up failed'
        })
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      isPwd,
      loading,
      handleLogin,
      handleSignup
    }
  }
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
}
</style>
