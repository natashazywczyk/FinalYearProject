<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-10">
        <q-btn flat icon="arrow_back" label="Back" to="/dashboard" class="q-mb-md" />

        <div class="text-h4 q-mb-md">Savings</div>
        <div class="text-subtitle1 q-mb-lg text-grey-7">
          Track how much money you've saved by resisting your cravings
        </div>

        <div v-if="!hasProduct && !isLoading" class="q-mb-md">
          <span>Make sure you have a product selected</span>
          <q-btn label="Select Product" to="/product-selection" color="primary" class="q-ml-sm" />
        </div>

        <!-- Question Screen -->
        <div v-if="!hasAnswered && hasProduct && !isLoading" class="q-mt-xl">
          <q-card flat bordered class="q-pa-lg">
            <q-card-section class="text-center">
              <div class="text-h5 q-mb-lg">Did you buy your nicotine product today?</div>
              <div class="row q-col-gutter-md justify-center">
                <div class="col-12 col-sm-4">
                  <q-btn
                    label="Yes"
                    size="lg"
                    class="full-width pastel-orange"
                    @click="purchaseAnswer(true)"
                    unelevated
                  />
                </div>
                <div class="col-12 col-sm-4">
                  <q-btn
                    label="No"
                    size="lg"
                    class="full-width pastel-green"
                    @click="purchaseAnswer(false)"
                    unelevated
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Answered (non-editing) -->
        <transition name="fade">
          <div v-if="hasAnswered && !editing" class="q-mt-xl row justify-center">
            <q-card
              flat
              bordered
              class="q-pa-lg q-mb-lg text-center"
              style="max-width: 400px; width: 100%"
            >
              <q-card-section>
                <div class="text-h6 q-mb-sm">
                  {{ boughtProduct ? 'Product bought today' : 'No product bought today' }}
                </div>
                <q-btn flat color="primary" label="Edit" icon="edit" @click="enableEditing" />
              </q-card-section>
            </q-card>
          </div>
        </transition>

        <!-- Edit Screen -->
        <div v-if="editing" class="q-mt-xl">
          <q-card flat bordered class="q-pa-lg q-mb-lg">
            <q-card-section class="text-center">
              <div class="text-h5 q-mb-lg">Update: did you buy your nicotine product today?</div>
              <div class="row q-col-gutter-md justify-center q-mb-lg">
                <div class="col-12 col-sm-4">
                  <q-btn
                    label="Yes"
                    size="lg"
                    class="full-width"
                    :class="editAnswer === true ? 'pastel-orange' : 'bg-grey-3 text-grey-8'"
                    @click="editAnswer = true"
                    unelevated
                  />
                </div>
                <div class="col-12 col-sm-4">
                  <q-btn
                    label="No"
                    size="lg"
                    class="full-width"
                    :class="editAnswer === false ? 'pastel-green' : 'bg-grey-3 text-grey-8'"
                    @click="editAnswer = false"
                    unelevated
                  />
                </div>
              </div>
              <div class="row q-col-gutter-sm justify-center">
                <div class="col-auto">
                  <q-btn flat label="Cancel" @click="cancelEditing" style="min-width: 150px" />
                </div>
                <div class="col-auto">
                  <q-btn
                    color="primary"
                    label="Update"
                    @click="submitEdit"
                    unelevated
                    style="min-width: 150px"
                    :loading="isUpdating"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Savings Pot -->
        <div v-if="hasAnswered && imageLoaded" class="row justify-center q-mt-xl q-mb-xl">
          <div class="col-12 col-md-6 text-center">
            <div style="position: relative; display: inline-block; max-width: 500px; width: 100%">
              <img
                src="/images/savings-pot.png"
                alt="Pot of Gold"
                style="width: 100%; display: block"
              />
              <div
                style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)"
              >
                <div
                  class="text-h2 text-white"
                  style="font-weight: bold; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)"
                >
                  €{{ displayedSavings.toFixed(2) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading  -->
        <div
          v-if="isLoading || (!imageLoaded && hasAnswered)"
          class="row justify-center items-center"
          style="min-height: 400px"
        >
          <q-spinner color="primary" size="50px" />
        </div>
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

.pastel-orange {
  background-color: #ffd4a3 !important;
  color: #8b5a00 !important;
}

.pastel-orange:hover {
  background-color: #ffbc7f !important;
}

.pastel-green {
  background-color: #b8e6b8 !important;
  color: #2d5f2d !important;
}

.pastel-green:hover {
  background-color: #9fdb9f !important;
}
</style>
