<template>
  <q-page
    class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
    :class="$q.dark.isActive ? 'bg-gray-900' : 'bg-white'"
  >
    <router-link
      to="/login"
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
        Reset Password
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div
        v-if="tokenValid === null"
        class="flex justify-center items-center"
        style="min-height: 400px"
      >
        <q-spinner color="primary" size="50px" />
      </div>

      <!-- Invalid or expired token message -->
      <div v-else-if="tokenValid === false" class="mb-6">
        <div class="rounded-md p-4" :class="$q.dark.isActive ? 'bg-red-900/20' : 'bg-red-50'">
          <p
            class="text-sm font-medium"
            :class="$q.dark.isActive ? 'text-red-300' : 'text-red-800'"
          >
            This password reset link is invalid.
          </p>
          <router-link
            to="/login"
            class="mt-3 inline-block text-sm font-medium text-[#9874C2] hover:text-[#8260aa]"
          >
            Go back to Login
          </router-link>
        </div>
      </div>

      <!-- Password reset form -->
      <form v-else class="space-y-6" @submit.prevent="handleResetPassword">
        <div>
          <label
            for="newPassword"
            class="block text-sm/6 font-medium"
            :class="$q.dark.isActive ? 'text-gray-100' : 'text-gray-900'"
          >
            New Password
          </label>
          <div class="mt-1">
            <input
              v-model="newPassword"
              type="password"
              id="newPassword"
              required
              class="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9874C2] sm:text-sm/6"
              :class="
                $q.dark.isActive
                  ? 'bg-white/5 text-white outline-white/10 placeholder:text-gray-500'
                  : 'bg-gray-50 text-gray-900 outline-gray-300 placeholder:text-gray-400'
              "
              placeholder="Enter new password"
            />
            <p
              v-if="newPassword.length < 8 && newPassword.length > 0"
              class="text-sm mt-1"
              :class="$q.dark.isActive ? 'text-yellow-400' : 'text-yellow-600'"
            >
              Password must be at least 8 characters.
            </p>
          </div>
        </div>

        <div>
          <label
            for="confirmPassword"
            class="block text-sm/6 font-medium"
            :class="$q.dark.isActive ? 'text-gray-100' : 'text-gray-900'"
          >
            Confirm Password
          </label>
          <div class="mt-1">
            <input
              v-model="confirmPassword"
              type="password"
              id="confirmPassword"
              required
              class="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9874C2] sm:text-sm/6"
              :class="
                $q.dark.isActive
                  ? 'bg-white/5 text-white outline-white/10 placeholder:text-gray-500'
                  : 'bg-gray-50 text-gray-900 outline-gray-300 placeholder:text-gray-400'
              "
              placeholder="Confirm new password"
            />
            <p
              v-if="confirmPassword && newPassword !== confirmPassword"
              class="text-sm mt-1"
              :class="$q.dark.isActive ? 'text-red-400' : 'text-red-600'"
            >
              Passwords do not match
            </p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || newPassword.length < 8 || newPassword !== confirmPassword"
            class="flex w-full justify-center rounded-md bg-[#775AB8] px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-[#6B51A6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9874C2] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Resetting password...' : 'Reset Password' }}
          </button>
        </div>
      </form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { supabase } from 'boot/supabase';

const $q = useQuasar();
const router = useRouter();

const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const tokenValid = ref<boolean | null>(null);
let unsubscribeAuthListener: (() => void) | null = null;

// Check if there is a valid reset token on mount
onMounted(async () => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      tokenValid.value = true;
    } else if (!session) {
      tokenValid.value = false;
    }
  });

  unsubscribeAuthListener = () => subscription.unsubscribe();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    tokenValid.value = true;
  } else if (tokenValid.value === null) {
    tokenValid.value = false;
  }
});

onBeforeUnmount(() => {
  if (unsubscribeAuthListener) {
    unsubscribeAuthListener();
  }
});

// Handle password reset
const handleResetPassword = async () => {
  if (newPassword.value.length < 8) {
    $q.notify({
      type: 'negative',
      message: 'Password must be at least 8 characters',
    });
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    $q.notify({
      type: 'negative',
      message: 'Passwords do not match',
    });
    return;
  }

  loading.value = true;
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword.value,
    });

    if (error) throw error;

    $q.notify({
      type: 'positive',
      message: 'Password reset successfully!',
    });

    // Sign out and redirect to login
    await supabase.auth.signOut();
    await router.push('/login');
  } catch (error) {
    const err = error as Error;
    $q.notify({
      type: 'negative',
      message: err.message || 'Error resetting password',
    });
  } finally {
    loading.value = false;
  }
};
</script>
