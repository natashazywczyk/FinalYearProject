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
        Create your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="handleSignup">
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
          <label
            for="password"
            class="block text-sm/6 font-medium"
            :class="$q.dark.isActive ? 'text-gray-100' : 'text-gray-900'"
            >Password</label
          >
          <div class="mt-1">
            <input
              v-model="password"
              type="password"
              id="password"
              autocomplete="new-password"
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
          <label
            for="ageGroup"
            class="block text-sm/6 font-medium"
            :class="$q.dark.isActive ? 'text-gray-100' : 'text-gray-900'"
            >Age Group</label
          >
          <div class="mt-1">
            <select
              v-model="ageGroup"
              id="ageGroup"
              required
              class="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9874C2] sm:text-sm/6"
              :class="
                $q.dark.isActive
                  ? 'bg-gray-800 text-white outline-white/10'
                  : 'bg-gray-50 text-gray-900 outline-gray-300'
              "
            >
              <option value="" disabled :class="$q.dark.isActive ? 'bg-gray-800' : 'bg-white'">
                Select age group
              </option>
              <option
                v-for="option in ageGroupOptions"
                :key="option"
                :value="option"
                :class="$q.dark.isActive ? 'bg-gray-800' : 'bg-white'"
              >
                {{ option }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="flex w-full justify-center rounded-md bg-[#775AB8] px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-[#6B51A6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9874C2] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Creating account...' : 'Sign up' }}
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
              >Or sign up with</span
            >
          </div>
        </div>

        <div class="mt-6">
          <button
            type="button"
            :disabled="googleLoading"
            @click="signUpWithGoogle"
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
        Already have an account?
        <router-link to="/login" class="font-semibold text-[#9874C2] hover:text-[#8260aa]"
          >Sign in</router-link
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
const ageGroup = ref<string | null>(null);
const loading = ref(false);
const googleLoading = ref(false);

const ageGroupOptions = ['Under 18', '18-25', '25-30', '31-40', '41-50', '60+'];

// Handle Google OAuth sign up
const signUpWithGoogle = async () => {
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
      message: err.message || 'Error signing up with Google',
    });
    googleLoading.value = false;
  }
};

// Handle user sign up, authenticate the account when user created
const handleSignup = async () => {
  loading.value = true;
  try {
    // Create authenticated user
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;

    // Create profile in account table
    if (data.user) {
      const { error: profileError } = await supabase.from('account').insert([
        {
          user_id: data.user.id,
          age_group: ageGroup.value,
        },
      ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    $q.notify({
      type: 'positive',
      message: 'Sign up successful!',
    });

    await router.push('/dashboard');
  } catch (error) {
    // If there was a sign up error
    console.error('Signup error:', error);
    const err = error as Error;
    $q.notify({
      type: 'negative',
      message: err.message || 'Error signing up',
    });
  } finally {
    loading.value = false;
  }
};
</script>
