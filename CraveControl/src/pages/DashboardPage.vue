<template>
  <q-page class="px-6 py-8">
    <div class="text-h4 q-mb-md text-white">Welcome to CraveControl</div>
    <div class="text-subtitle1 q-mb-lg text-gray-400">
      Track your cravings and view your progress!
    </div>

    <!---Nicotine Product Selection--->
    <div class="mb-4">
      <div class="rounded-xl bg-gray-800/50 border border-white/10 p-6 text-center">
        <div class="text-white font-semibold text-lg mb-1">Nicotine Product Selection</div>
        <div class="text-gray-400 text-sm mb-4">
          Select the nicotine products you typically use/wanted to buy
        </div>
        <router-link
          to="/product-selection"
          class="inline-flex justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >Select Products</router-link
        >
      </div>
    </div>

    <!-- Savings -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="rounded-xl bg-gray-800/50 border border-white/10 p-6 text-center">
        <div class="text-white font-semibold text-lg mb-1">Check your savings</div>
        <div class="text-gray-400 text-sm mb-4">
          See how much money you've saved by controlling your cravings
        </div>
        <router-link
          to="/savings"
          class="inline-flex justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >View Savings</router-link
        >
      </div>

      <!--- Craving Tracking -->
      <div class="rounded-xl bg-gray-800/50 border border-white/10 p-6 text-center">
        <div class="text-white font-semibold text-lg mb-1">Craving Tracking</div>
        <div class="text-gray-400 text-sm mb-4">Enter and track your daily craving level</div>
        <router-link
          to="/log-craving"
          class="inline-flex justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >Log Craving Level</router-link
        >
      </div>

      <!--- Learn More -->
      <div class="rounded-xl bg-gray-800/50 border border-white/10 p-6 text-center">
        <div class="text-white font-semibold text-lg mb-1">Learn more</div>
        <div class="text-gray-400 text-sm mb-4">TBA</div>
        <router-link
          to="/information"
          class="inline-flex justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >Learn More</router-link
        >
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts"></script>
