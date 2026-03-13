<template>
  <q-page class="px-6 py-8" :class="$q.dark.isActive ? 'bg-gray-900' : 'bg-gray-100'">
    <div class="max-w-5xl mx-auto">
      <router-link
        to="/dashboard"
        class="inline-flex items-center gap-1 text-sm font-medium mb-6"
        :class="
          $q.dark.isActive ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
        "
      >
        <span class="material-icons text-base">arrow_back</span>
        Back
      </router-link>

      <div
        class="text-3xl font-bold mb-2"
        :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
      >
        Savings
      </div>
      <div class="text-sm mb-8" :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'">
        Track how much money you've saved by resisting your cravings
      </div>

      <!-- No product selected -->
      <div
        v-if="!hasProduct && !isLoading"
        class="rounded-xl p-6 border mb-6 flex items-center gap-4"
        :class="
          $q.dark.isActive ? 'bg-gray-800/50 border-white/10' : 'bg-white border-gray-200 shadow-sm'
        "
      >
        <span class="text-sm" :class="$q.dark.isActive ? 'text-gray-300' : 'text-gray-700'"
          >Make sure you have a product selected</span
        >
        <router-link
          to="/product-selection"
          class="rounded-md bg-[#775AB8] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#6B51A6]"
          >Select Product</router-link
        >
      </div>

      <!-- Question Screen -->
      <div v-if="!hasAnswered && hasProduct && !isLoading">
        <div
          class="rounded-xl p-6 border"
          :class="
            $q.dark.isActive
              ? 'bg-gray-800/50 border-white/10'
              : 'bg-white border-gray-200 shadow-sm'
          "
        >
          <div
            class="text-xl font-semibold text-center mb-6"
            :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
          >
            Did you buy your nicotine product today?
          </div>
          <div class="flex justify-center gap-4">
            <button
              @click="purchaseAnswer(true)"
              class="rounded-md px-8 py-3 text-sm font-semibold text-white transition-colors"
              style="background-color: #ef4444"
              onmouseover="this.style.backgroundColor='#dc2626'"
              onmouseout="this.style.backgroundColor='#ef4444'"
            >
              Yes
            </button>
            <button
              @click="purchaseAnswer(false)"
              class="rounded-md px-8 py-3 text-sm font-semibold text-white transition-colors"
              style="background-color: #22c55e"
              onmouseover="this.style.backgroundColor='#16a34a'"
              onmouseout="this.style.backgroundColor='#22c55e'"
            >
              No
            </button>
          </div>
        </div>
      </div>

      <!-- Answered (non-editing) -->
      <transition name="fade">
        <div v-if="hasAnswered && !editing" class="flex justify-center">
          <div
            class="rounded-xl p-6 border text-center w-full max-w-sm"
            :class="
              $q.dark.isActive
                ? 'bg-gray-800/50 border-white/10'
                : 'bg-white border-gray-200 shadow-sm'
            "
          >
            <div
              class="text-lg font-semibold mb-3"
              :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
            >
              {{ boughtProduct ? 'Product bought today' : 'No product bought today' }}
            </div>
            <button
              @click="enableEditing"
              class="inline-flex items-center gap-1 text-sm font-medium text-[#775AB8] hover:text-[#6B51A6]"
            >
              <span class="material-icons text-base">edit</span>
              Edit
            </button>
          </div>
        </div>
      </transition>

      <!-- Edit Screen -->
      <div
        v-if="editing"
        class="rounded-xl p-6 border mb-6"
        :class="
          $q.dark.isActive ? 'bg-gray-800/50 border-white/10' : 'bg-white border-gray-200 shadow-sm'
        "
      >
        <div
          class="text-xl font-semibold text-center mb-6"
          :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
        >
          Did you buy your nicotine product today?
        </div>
        <div class="flex justify-center gap-4 mb-6">
          <button
            @click="editAnswer = true"
            class="rounded-md px-8 py-3 text-sm font-semibold text-white transition-colors"
            :style="editAnswer === true ? 'background-color:#ef4444' : ''"
            :class="
              editAnswer === true
                ? ''
                : $q.dark.isActive
                  ? 'bg-white/10 text-gray-300'
                  : 'bg-gray-200 text-gray-700'
            "
          >
            Yes
          </button>
          <button
            @click="editAnswer = false"
            class="rounded-md px-8 py-3 text-sm font-semibold text-white transition-colors"
            :style="editAnswer === false ? 'background-color:#22c55e' : ''"
            :class="
              editAnswer === false
                ? ''
                : $q.dark.isActive
                  ? 'bg-white/10 text-gray-300'
                  : 'bg-gray-200 text-gray-700'
            "
          >
            No
          </button>
        </div>
        <div class="flex justify-center gap-3">
          <button
            @click="cancelEditing"
            class="rounded-md border px-6 py-2 text-sm font-semibold transition-colors"
            :class="
              $q.dark.isActive
                ? 'border-white/10 text-gray-300 hover:bg-white/10'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            "
          >
            Cancel
          </button>
          <button
            @click="submitEdit"
            class="rounded-md bg-[#775AB8] px-6 py-2 text-sm font-semibold text-white hover:bg-[#6B51A6] disabled:opacity-50"
            :disabled="isUpdating"
          >
            {{ isUpdating ? 'Updating...' : 'Update' }}
          </button>
        </div>
      </div>

      <!-- Savings Pot -->
      <div v-if="hasAnswered && imageLoaded" class="flex justify-center mt-8 mb-8">
        <div
          class="text-center"
          style="position: relative; display: inline-block; max-width: 500px; width: 100%"
        >
          <img
            src="/images/savings-pot.png"
            alt="Pot of Gold"
            style="width: 100%; display: block"
          />
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">
            <div
              class="text-white font-bold text-5xl"
              style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)"
            >
              €{{ displayedSavings.toFixed(2) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div
        v-if="isLoading || (!imageLoaded && hasAnswered)"
        class="flex justify-center items-center"
        style="min-height: 400px"
      >
        <q-spinner color="primary" size="50px" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { supabase } from '../boot/supabase';

const $q = useQuasar();
const imageLoaded = ref(false);
const displayedSavings = ref(0);
const totalSavings = ref(0);
const hasProduct = ref(false);
const hasAnswered = ref(false);
const boughtProduct = ref(false);
const productPrice = ref(0);
const isLoading = ref(true);
const editing = ref(false);
const editAnswer = ref<boolean | null>(null);
const isUpdating = ref(false);
const purchaseAnswer = async (answer: boolean) => {
  boughtProduct.value = answer;
  hasAnswered.value = true;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      // Save the answer to database
      await supabase.from('daily_purchases').upsert(
        {
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          purchased: answer,
        },
        {
          onConflict: 'user_id,date',
        },
      );

      // If they didn't purchase, add to their savings
      if (!answer) {
        const { data: account, error: fetchError } = await supabase
          .from('account')
          .select('total_savings')
          .eq('user_id', user.id)
          .single();

        if (fetchError) {
          console.error('Error fetching account:', fetchError);
          return;
        }

        const currentSavings = account?.total_savings ?? 0;
        const newSavings = currentSavings + productPrice.value;

        const { error: updateError } = await supabase
          .from('account')
          .update({ total_savings: newSavings })
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error updating savings:', updateError);
          return;
        }

        totalSavings.value = newSavings;
      } else {
        // If product was purchased, just show overall savings, no incrementation
        const { data: account } = await supabase
          .from('account')
          .select('total_savings')
          .eq('user_id', user.id)
          .single();

        totalSavings.value = account?.total_savings || 0;
      }

      // Notify MainLayout to update savings in side drawer
      window.dispatchEvent(
        new CustomEvent('savingsUpdated', { detail: { totalSavings: totalSavings.value } }),
      );
    }
  } catch (error) {
    console.log('Error saving purchase decision:', error);
  }

  // Load image and animate after answer
  const img = new Image();
  img.src = '/images/savings-pot.png';
  img.onload = () => {
    imageLoaded.value = true;
    animateSavings();
  };
};

const enableEditing = () => {
  editAnswer.value = boughtProduct.value;
  editing.value = true;
};

const cancelEditing = () => {
  editing.value = false;
  editAnswer.value = null;
};

const submitEdit = async () => {
  if (editAnswer.value === null) {
    $q.notify({ type: 'warning', message: 'Please select Yes or No' });
    return;
  }

  isUpdating.value = true;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const newAnswer = editAnswer.value;
      const oldAnswer = boughtProduct.value;

      // Update daily_purchases
      await supabase.from('daily_purchases').upsert(
        {
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          purchased: newAnswer,
        },
        { onConflict: 'user_id,date' },
      );

      // Change total_savings based on the edit
      if (oldAnswer !== newAnswer) {
        const delta = newAnswer ? -productPrice.value : productPrice.value;
        const newSavings = Math.max(0, totalSavings.value + delta);

        await supabase.from('account').update({ total_savings: newSavings }).eq('user_id', user.id);

        totalSavings.value = newSavings;
        displayedSavings.value = newSavings;
      }

      boughtProduct.value = newAnswer;
      editing.value = false;
      editAnswer.value = null;

      // Notify MainLayout to update savings in side drawer
      window.dispatchEvent(
        new CustomEvent('savingsUpdated', { detail: { totalSavings: totalSavings.value } }),
      );

      $q.notify({ type: 'positive', message: 'Purchase updated!' });
    }
  } catch (error) {
    console.error('Error updating purchase:', error);
    $q.notify({ type: 'negative', message: 'Failed to update purchase' });
  } finally {
    isUpdating.value = false;
  }
};

const animateSavings = () => {
  const duration = 1200;
  const steps = 60;
  const increment = totalSavings.value / steps;
  const stepDuration = duration / steps;

  let currentStep = 0;

  const timer = setInterval(() => {
    currentStep++;
    displayedSavings.value += increment;

    if (currentStep >= steps) {
      displayedSavings.value = totalSavings.value;
      clearInterval(timer);
    }
  }, stepDuration);
};

onMounted(async () => {
  // Check if user has already selected a product
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: account } = await supabase
      .from('account')
      .select('product_name, product_price, total_savings')
      .eq('user_id', user.id)
      .single();

    hasProduct.value = !!account?.product_name;

    if (account?.product_price) {
      // Handle both string and number formats
      if (typeof account.product_price === 'string') {
        // Replace comma with full stop for correct saving calculation
        const normalized = account.product_price.replace(',', '.').replace(/[^0-9.]/g, '');
        productPrice.value = parseFloat(normalized);
      } else {
        productPrice.value = account.product_price;
      }
    }

    // Set current savings from database
    totalSavings.value = account?.total_savings || 0;

    // Check if user already answered today
    const today = new Date().toISOString().split('T')[0];
    const { data: todayAnswer } = await supabase
      .from('daily_purchases')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (todayAnswer) {
      // If user has already answered, show savings
      // Don't show purchase question again
      hasAnswered.value = true;
      boughtProduct.value = todayAnswer.purchased;

      // Load savings image
      const img = new Image();
      img.src = '/images/savings-pot.png';
      img.onload = () => {
        imageLoaded.value = true;
        isLoading.value = false;
        animateSavings();
      };
    } else {
      // If user hasn't answered today, show question
      isLoading.value = false;
    }
  }
});
</script>

<style scoped>
.fade-enter-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-to {
  opacity: 1;
}
</style>
