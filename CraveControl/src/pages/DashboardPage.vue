<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-10">
        <div class="text-h4 q-mb-md">Welcome to CraveControl</div>
        <div class="text-subtitle1 q-mb-lg text-grey-7">
          Track your cravings and view your progress!
        </div>

        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12">
            <q-card class="cursor-pointer" flat bordered>
              <q-card-section class="text-center">
                <div class="text-h6">Nicotine Product Selection</div>
                <div class="text-caption text-grey-7 q-mt-sm">
                  Select the nicotine products you typically use/wanted to buy
                </div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn color="primary" label="Select Products" unelevated to="/product-selection" />
              </q-card-actions>
            </q-card>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-card class="cursor-pointer" flat bordered>
              <q-card-section class="text-center">
                <div class="text-h6">Check your savings</div>
                <div class="text-caption text-grey-7 q-mt-sm">
                  See how much money you've saved by controlling your cravings
                </div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn color="primary" label="View Savings" unelevated to="/savings" />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card class="cursor-pointer" flat bordered>
              <q-card-section class="text-center">
                <div class="text-h6">Craving Tracking</div>
                <div class="text-caption text-grey-7 q-mt-sm">
                  Enter and track your daily craving level
                </div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn color="primary" label="Log Craving Level" unelevated to="/log-craving" />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card class="cursor-pointer" flat bordered>
              <q-card-section class="text-center">
                <div class="text-h6">Learn more</div>
                <div class="text-caption text-grey-7 q-mt-sm">
                  TBA
                </div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn color="primary" label="Learn More" unelevated to="/information" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
//mport { useQuasar } from 'quasar';

//const $q = useQuasar();
</script>
