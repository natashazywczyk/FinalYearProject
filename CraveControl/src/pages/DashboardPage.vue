<template>
  <q-page class="px-6 py-8" :class="$q.dark.isActive ? 'bg-gray-900' : 'bg-gray-100'">
    <div class="text-h4 q-mb-md" :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'">
      Welcome to CraveControl
    </div>
    <div
      class="text-subtitle1 q-mb-lg"
      :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'"
    >
      Track your cravings and view your progress!
    </div>

    <!---Nicotine Product Selection--->
    <div class="mb-4">
      <div
        class="rounded-xl p-6 text-center border"
        :class="
          $q.dark.isActive ? 'bg-gray-800/50 border-white/10' : 'bg-white border-gray-200 shadow-sm'
        "
      >
        <div
          class="font-semibold text-lg mb-1"
          :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
        >
          Nicotine Product Selection
        </div>
        <div class="text-sm mb-4" :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'">
          Select the nicotine products you typically use/wanted to buy
        </div>
        <router-link
          to="/product-selection"
          class="inline-flex justify-center rounded-md bg-[#775AB8] px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-[#6B51A6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9874C2]"
          >Select Products</router-link
        >
      </div>
    </div>

    <!-- Three cards row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        class="rounded-xl p-6 text-center border"
        :class="
          $q.dark.isActive ? 'bg-gray-800/50 border-white/10' : 'bg-white border-gray-200 shadow-sm'
        "
      >
        <div
          class="font-semibold text-lg mb-1"
          :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
        >
          Check your savings
        </div>
        <div class="text-sm mb-4" :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'">
          See how much money you've saved by controlling your cravings
        </div>
        <router-link
          to="/savings"
          class="inline-flex justify-center rounded-md bg-[#775AB8] px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-[#6B51A6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9874C2]"
          >View Savings</router-link
        >
      </div>

      <div
        class="rounded-xl p-6 text-center border"
        :class="
          $q.dark.isActive ? 'bg-gray-800/50 border-white/10' : 'bg-white border-gray-200 shadow-sm'
        "
      >
        <div
          class="font-semibold text-lg mb-1"
          :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
        >
          Craving Tracking
        </div>
        <div class="text-sm mb-4" :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'">
          Enter and track your daily craving level
        </div>
        <router-link
          to="/log-craving"
          class="inline-flex justify-center rounded-md bg-[#775AB8] px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-[#6B51A6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9874C2]"
          >Log Craving Level</router-link
        >
      </div>

      <div
        class="rounded-xl p-6 text-center border"
        :class="
          $q.dark.isActive ? 'bg-gray-800/50 border-white/10' : 'bg-white border-gray-200 shadow-sm'
        "
      >
        <div
          class="font-semibold text-lg mb-1"
          :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
        >
          Learn more
        </div>
        <div class="text-sm mb-4" :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'">
          Read information about nicotine
        </div>
        <router-link
          to="/information"
          class="inline-flex justify-center rounded-md bg-[#775AB8] px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-[#6B51A6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9874C2]"
          >Learn More</router-link
        >
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
const $q = useQuasar();
</script>
