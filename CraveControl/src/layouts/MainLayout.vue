<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      v-if="isLoggedIn"
      flat
      :style="{
        backgroundColor: $q.dark.isActive ? '#030712' : '#e5e7eb',
      }"
      class="shadow-sm border-b"
      :class="$q.dark.isActive ? 'shadow-none border-white/10' : 'border-gray-200'"
    >
      <div class="px-4">
        <div class="flex h-16 items-center space-x-4">
          <q-btn
            v-if="isLoggedIn"
            flat
            dense
            round
            icon="menu"
            :color="$q.dark.isActive ? 'white' : 'grey-9'"
            @click="drawerOpen = !drawerOpen"
          />
          <a
            v-if="isDashboard"
            class="rounded-md px-3 py-2 text-sm font-medium bg-[#775AB8] text-white hover:bg-[#6B51A6] ml-2"
            aria-current="page"
          >
            Dashboard
          </a>
        </div>
      </div>
    </q-header>

    <!-- Side Menu -->
    <TransitionRoot as="template" :show="drawerOpen">
      <Dialog class="relative z-[2001]" @close="drawerOpen = false">
        <TransitionChild
          as="template"
          enter="ease-in-out duration-500"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in-out duration-500"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500/75 transition-opacity dark:bg-gray-900/50"></div>
        </TransitionChild>

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10 sm:pr-16">
              <TransitionChild
                as="template"
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enter-from="-translate-x-full"
                enter-to="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leave-from="translate-x-0"
                leave-to="-translate-x-full"
              >
                <DialogPanel class="pointer-events-auto relative w-screen max-w-xs">
                  <div
                    class="relative flex h-full flex-col overflow-y-auto shadow-xl"
                    :class="$q.dark.isActive ? 'bg-gray-800' : 'bg-white'"
                  >
                    <div
                      class="px-4 sm:px-6 pt-4 pb-5 border-b"
                      :class="$q.dark.isActive ? 'border-white/10' : 'border-gray-200'"
                    >
                      <div class="flex justify-end">
                        <button
                          type="button"
                          class="rounded-md p-1 transition-colors"
                          :class="
                            $q.dark.isActive
                              ? 'text-gray-400 hover:text-white hover:bg-white/10'
                              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                          "
                          @click="drawerOpen = false"
                        >
                          <span class="sr-only">Close panel</span>
                          <XMarkIcon class="size-5" aria-hidden="true" />
                        </button>
                      </div>
                      <div class="flex items-center gap-3 mt-2">
                        <span class="material-icons" style="font-size: 2rem; color: #6366f1"
                          >account_circle</span
                        >
                        <span
                          class="text-sm font-medium break-all"
                          :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
                          >{{ userEmail }}</span
                        >
                      </div>
                    </div>

                    <!-- Savings -->
                    <div class="mt-4 flex-1 px-4 sm:px-6 space-y-4">
                      <div class="flex items-center gap-3">
                        <span class="material-icons text-green-600">savings</span>
                        <div class="leading-none">
                          <p
                            class="text-xs"
                            :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'"
                          >
                            Savings
                          </p>
                          <!-- Product -->
                          <p
                            class="text-sm font-medium"
                            :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
                          >
                            €{{ totalSavings.toFixed(2) }}
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center gap-3">
                        <span class="material-icons text-blue-600">inventory_2</span>
                        <div class="leading-none">
                          <p
                            class="text-xs"
                            :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'"
                          >
                            Product
                          </p>
                          <p
                            class="text-sm font-medium"
                            :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
                          >
                            {{ productName || 'None selected' }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Logout -->
                    <div
                      class="px-4 sm:px-6 pt-4 border-t"
                      :class="$q.dark.isActive ? 'border-white/10' : 'border-gray-200'"
                    >
                      <button
                        @click="handleLogout"
                        class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <span class="material-icons text-red-500">logout</span>
                        Logout
                      </button>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { supabase } from 'boot/supabase';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const isLoggedIn = ref(false);
const drawerOpen = ref(false);
const userEmail = ref('');
const totalSavings = ref(0);
const productName = ref('');

const isDashboard = computed(() => route.path === '/dashboard');

// Sync Tailwind dark class with Quasar dark mode
watch(
  () => $q.dark.isActive,
  (isDark) => {
    document.documentElement.classList.toggle('dark', isDark);
  },
  { immediate: true },
);

const loadAccountData = async (userId: string): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    userEmail.value = user.email || user.id;
  }
  const { data: account } = await supabase
    .from('account')
    .select('total_savings, product_name')
    .eq('user_id', userId)
    .single();
  totalSavings.value = account?.total_savings ?? 0;
  productName.value = account?.product_name ?? '';
};

const checkAuthState = async (): Promise<void> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  isLoggedIn.value = !!session;
  if (session) {
    void loadAccountData(session.user.id);
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
    if (session) {
      void loadAccountData(session.user.id);
    } else {
      userEmail.value = '';
      totalSavings.value = 0;
      productName.value = '';
    }
  });

  // Listen for savings update events from SavingsPage
  window.addEventListener('savingsUpdated', (event: Event) => {
    const customEvent = event as CustomEvent;
    if (customEvent.detail?.totalSavings !== undefined) {
      totalSavings.value = customEvent.detail.totalSavings;
    }
  });

  // Listen for product update events from NicotineProductSelectionPage
  window.addEventListener('productUpdated', (event: Event) => {
    const customEvent = event as CustomEvent;
    if (customEvent.detail?.productName !== undefined) {
      productName.value = customEvent.detail.productName;
    }
  });
});
</script>
