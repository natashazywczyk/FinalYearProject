<template>
  <q-page
    class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
    :class="$q.dark.isActive ? 'bg-gray-900' : 'bg-white'"
  >
    <router-link
      to="/"
      class="absolute top-8 left-8 inline-flex items-center gap-1 text-sm font-medium"
      :class="
        $q.dark.isActive ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
      "
    >
      <span class="material-icons text-base">arrow_back</span>
      Back
    </router-link>
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2
        class="mt-10 text-center text-2xl/9 font-bold tracking-tight"
        :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
      >
        Log in
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="handleLogin">
        <div>
          <label
            for="email"
            class="block text-sm/6 font-medium"
            :class="$q.dark.isActive ? 'text-gray-100' : 'text-gray-900'"
            >Email address</label
          >
          <div class="mt-1">
            <input
              v-model="email"
              type="email"
              id="email"
              autocomplete="email"
              required
              class="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9874C2] sm:text-sm/6"
              :class="
                $q.dark.isActive
                  ? 'bg-white/5 text-white outline-white/10 placeholder:text-gray-500'
                  : 'bg-gray-50 text-gray-900 outline-gray-300 placeholder:text-gray-400'
              "
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label
              for="password"
              class="block text-sm/6 font-medium"
              :class="$q.dark.isActive ? 'text-gray-100' : 'text-gray-900'"
              >Password</label
            >
          </div>
          <div class="mt-1">
            <input
              v-model="password"
              type="password"
              id="password"
              autocomplete="current-password"
              required
              class="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9874C2] sm:text-sm/6"
              :class="
                $q.dark.isActive
                  ? 'bg-white/5 text-white outline-white/10 placeholder:text-gray-500'
                  : 'bg-gray-50 text-gray-900 outline-gray-300 placeholder:text-gray-400'
              "
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="flex w-full justify-center rounded-md bg-[#775AB8] px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-[#6B51A6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9874C2] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Signing in...' : 'Log in' }}
          </button>
        </div>
      </form>

      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div
              class="w-full border-t"
              :class="$q.dark.isActive ? 'border-white/10' : 'border-gray-300'"
            />
          </div>
          <div class="relative flex justify-center text-sm/6">
            <span
              class="px-6"
              :class="$q.dark.isActive ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'"
              >Or sign in with</span
            >
          </div>
        </div>

        <div class="mt-6">
          <button
            type="button"
            :disabled="googleLoading"
            @click="signInWithGoogle"
            class="flex w-full items-center justify-center gap-3 rounded-md border px-3 py-1.5 text-sm/6 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9874C2] disabled:opacity-50 disabled:cursor-not-allowed"
            :class="
              $q.dark.isActive
                ? 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
            "
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              class="h-5 w-5"
              alt="Google"
            />
            {{ googleLoading ? 'Redirecting...' : 'Google' }}
          </button>
        </div>
      </div>

      <p
        class="mt-10 text-center text-sm/6"
        :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'"
      >
        Don't have an account?
        <router-link to="/signup" class="font-semibold text-[#9874C2] hover:text-[#8260aa]"
          >Create an account</router-link
        >
      </p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { supabase } from 'boot/supabase';

const $q = useQuasar();
const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const googleLoading = ref(false);

// Handle Google OAuth sign in
const signInWithGoogle = async () => {
  googleLoading.value = true;
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/#/auth-callback`,
      },
    });

    if (error) throw error;
  } catch (error) {
    const err = error as Error;
    $q.notify({
      type: 'negative',
      message: err.message || 'Error signing in with Google',
    });
    googleLoading.value = false;
  }
};

// Handle user log in, with previously created account
const handleLogin = async () => {
  loading.value = true;
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;

    $q.notify({
      type: 'positive',
      message: 'Signed in successfully!',
    });

    await router.push('/dashboard');
  } catch (error) {
    const err = error as Error;
    $q.notify({
      type: 'negative',
      message: err.message || 'Error signing in',
    });
  } finally {
    loading.value = false;
  }
};
</script>
