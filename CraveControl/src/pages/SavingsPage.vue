<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-10">

        <q-btn flat icon="arrow_back" label="Back" to="/dashboard" class="q-mb-md" />

        <div class="text-h4 q-mb-md">Savings</div>
        <div class="text-subtitle1 q-mb-lg text-grey-7">
          Track how much money you've saved by resisting your cravings
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
                <div class="text-h3 text-white" style="font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">€0.00</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
</script>
