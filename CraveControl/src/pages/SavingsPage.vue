<template>
  <q-page class="q-pa-md">
    <div v-if="imageLoaded" class="row justify-center">
      <div class="col-12 col-md-10">

        <q-btn flat icon="arrow_back" label="Back" to="/dashboard" class="q-mb-md" />

        <div class="text-h4 q-mb-md">Savings</div>
        <div class="text-subtitle1 q-mb-lg text-grey-7">
          Track how much money you've saved by resisting your cravings
        </div>

        <div class="q-mb-md">
          <span>Make sure you have a product selected</span>
          <q-btn
            label="Select Product"
            to="/product-selection"
            color="primary"
            class="q-ml-sm"
          />
        </div>

        <div class="row justify-center q-mt-xl q-mb-xl">
          <div class="col-12 col-md-6 text-center">
            <div style="position: relative; display: inline-block; max-width: 500px; width: 100%;">
              <img
                src="/images/savings-pot.png"
                alt="Pot of Gold"
                style="width: 100%; display: block;"
              />
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                <div class="text-h2 text-white" style="font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">€{{ displayedSavings.toFixed(2) }}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div v-else class="row justify-center items-center" style="min-height: 400px;">
      <q-spinner color="primary" size="50px" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const imageLoaded = ref(false);
const displayedSavings = ref(0);
const targetSavings = ref(10); // Example target savings amount for demo

const animateSavings = () => {
  const duration = 1200;
  const steps = 60;
  const increment = targetSavings.value / steps;
  const stepDuration = duration / steps;

  let currentStep = 0;

  const timer = setInterval(() => {
    currentStep++;
    displayedSavings.value += increment;

    if (currentStep >= steps) {
      displayedSavings.value = targetSavings.value;
      clearInterval(timer);
    }
  }, stepDuration);
};

onMounted(() => {
  const img = new Image();
  img.src = '/images/savings-pot.png';
  img.onload = () => {
    imageLoaded.value = true;
    animateSavings();
  };
});
</script>
