<template>
  <q-page
    class="flex flex-center flex-col"
    :class="$q.dark.isActive ? 'bg-gray-900' : 'bg-gray-100'"
  >
    <div class="text-5xl font-bold mb-3 text-center" :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'">
      Welcome to CraveControl
    </div>
    <div class="text-lg mb-10 text-center" :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'">
      Get started
    </div>
    <div class="flex gap-4">
      <router-link
        to="/login"
        class="rounded-md bg-[#775AB8] px-8 py-3 text-base font-semibold text-white hover:bg-[#6B51A6]"
      >Login</router-link>
      <router-link
        to="/signup"
        class="rounded-md border px-8 py-3 text-base font-semibold transition-colors"
        :class="$q.dark.isActive ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'"
      >Sign Up</router-link>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
const $q = useQuasar();
</script>
