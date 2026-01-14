<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <div @click="goHome" style="cursor: pointer; text-decoration: none; color: inherit">
            CraveControl
          </div>
        </q-toolbar-title>

        <q-btn v-if="isLoggedIn" flat label="Logout" @click="handleLogout" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { supabase } from 'boot/supabase';

const router = useRouter();
const $q = useQuasar();
const isLoggedIn = ref(false);

const checkAuthState = async (): Promise<void> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  isLoggedIn.value = !!session;
};

const goHome = async (): Promise<void> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    await router.push('/dashboard');
  } else {
    await router.push('/');
  }
};

const handleLogout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    $q.notify({
      type: 'negative',
      message: 'Error signing out',
    });
    return;
  }

  isLoggedIn.value = false;
  $q.notify({
    type: 'positive',
    message: 'Logged out successfully',
  });
  await router.push('/');
};

onMounted(() => {
  void checkAuthState();

  // Listen for auth state changes
  supabase.auth.onAuthStateChange((_event, session) => {
    isLoggedIn.value = !!session;
  });
});
</script>
