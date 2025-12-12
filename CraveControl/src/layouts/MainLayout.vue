<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <div @click="goHome" style="cursor: pointer; text-decoration: none; color: inherit">
            CraveControl
          </div>
        </q-toolbar-title>

        <q-btn v-if="!isLoggedIn" flat label="Login" to="/login" />
        <q-btn v-else flat label="Logout" @click="handleLogout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

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
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';

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

onMounted(async () => {
  await checkAuthState();

  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    isLoggedIn.value = !!session;
  });
});

const linksList: EssentialLinkProps[] = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
