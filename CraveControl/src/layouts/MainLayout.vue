<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn v-if="isLoggedIn" flat dense round icon="menu" @click="drawerOpen = !drawerOpen" />
        <q-toolbar-title>
          <div @click="goHome" style="cursor: pointer; text-decoration: none; color: inherit">
            CraveControl
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Side Menu -->
    <q-drawer v-model="drawerOpen" side="left" overlay bordered behavior="mobile">
      <q-btn
        flat
        dense
        round
        icon="close"
        size="sm"
        @click="drawerOpen = false"
        style="position: absolute; top: 6px; right: 6px; z-index: 1"
      />
      <q-list>
        <!-- User Info -->
        <!-- Email -->
        <q-item class="q-pt-lg q-pb-md">
          <q-item-section avatar>
            <q-icon name="account_circle" size="40px" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-body2 text-weight-medium" style="word-break: break-all">
              {{ userEmail }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <!-- Savings -->
        <q-item class="q-mt-sm">
          <q-item-section avatar>
            <q-icon name="savings" color="green-7" />
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Savings</q-item-label>
            <q-item-label>€{{ totalSavings.toFixed(2) }}</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Product -->
        <q-item>
          <q-item-section avatar>
            <q-icon name="inventory_2" color="blue-7" />
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Product</q-item-label>
            <q-item-label>{{ productName || 'None selected' }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <!-- Logout -->
        <q-item clickable v-ripple @click="handleLogout" class="q-mt-auto text-negative">
          <q-item-section avatar>
            <q-icon name="logout" color="negative" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Logout</q-item-label>
          </q-item-section>
        </q-item>
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

const router = useRouter();
const $q = useQuasar();
const isLoggedIn = ref(false);
const drawerOpen = ref(false);
const userEmail = ref('');
const totalSavings = ref(0);
const productName = ref('');

const loadUserData = async (): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    userEmail.value = user.email ?? '';
    const { data: account } = await supabase
      .from('account')
      .select('total_savings, product_name')
      .eq('user_id', user.id)
      .single();
    totalSavings.value = account?.total_savings ?? 0;
    productName.value = account?.product_name ?? '';
  }
};

const checkAuthState = async (): Promise<void> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  isLoggedIn.value = !!session;
  if (session) void loadUserData();
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
    $q.notify({ type: 'negative', message: 'Error signing out' });
    return;
  }
  isLoggedIn.value = false;
  drawerOpen.value = false;
  $q.notify({ type: 'positive', message: 'Logged out successfully' });
  await router.push('/');
};

onMounted(() => {
  void checkAuthState();

  supabase.auth.onAuthStateChange((_event, session) => {
    isLoggedIn.value = !!session;
    if (session) void loadUserData();
    else {
      userEmail.value = '';
      totalSavings.value = 0;
      productName.value = '';
    }
  });
});
</script>
