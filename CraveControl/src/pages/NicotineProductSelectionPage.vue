<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-10">
        <q-btn flat icon="arrow_back" label="Back" to="/dashboard" class="q-mb-md" />

        <div class="text-h4 q-mb-md">Nicotine Product Selection</div>
        <div class="text-subtitle1 q-mb-lg text-grey-7">
          Select the nicotine product you usually use/thought of buying
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-select
              v-model="selectedDisposable"
              :options="disposableOptions"
              label="Disposable"
              outlined
              clearable
              option-label="name"
              option-value="name"
              options-dense
              behavior="menu"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar v-if="scope.opt.imageUrl">
                    <q-avatar rounded>
                      <img :src="scope.opt.imageUrl" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                    <q-item-label caption>€{{ scope.opt.price }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:selected-item="scope">
                <div class="ellipsis">{{ scope.opt.name }}</div>
              </template>
            </q-select>
            <div v-if="selectedDisposable" class="q-mt-md">
              <q-card>
                <q-card-section class="text-center">
                  <img
                    v-if="selectedDisposable.imageUrl"
                    :src="selectedDisposable.imageUrl"
                    style="max-width: 150px; max-height: 150px"
                    class="q-mb-md"
                  />
                  <div class="text-subtitle1">{{ selectedDisposable.name }}</div>
                  <div class="text-h6 text-primary q-mt-sm">€{{ selectedDisposable.price }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <q-select
              v-model="selectedLiquid"
              :options="liquidOptions"
              label="Liquids"
              outlined
              clearable
              option-label="name"
              option-value="name"
              options-dense
              behavior="menu"
            >
              <!-- Fill with products from json for nicotine liquids -->
            </q-select>
            <div v-if="selectedLiquid" class="q-mt-md">
              <q-card>
                <q-card-section class="text-center">
                  <div class="text-subtitle1">{{ selectedLiquid.name }}</div>
                  <div class="text-h6 text-primary q-mt-sm">{{ selectedLiquid.price }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <q-select
              v-model="selectedPatch"
              :options="patchOptions"
              label="Nicotine Patches"
              outlined
              clearable
              option-label="name"
              option-value="name"
              options-dense
              behavior="menu"
            >
              <!-- Fill with products from json for nicotine patches -->
            </q-select>
            <div v-if="selectedPatch" class="q-mt-md">
              <q-card>
                <q-card-section class="text-center">
                  <div class="text-subtitle1">{{ selectedPatch.name }}</div>
                  <div class="text-h6 text-primary q-mt-sm">{{ selectedPatch.price }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <div class="row justify-center q-mt-lg">
          <q-btn
            color="primary"
            label="Save"
            size="lg"
            :disable="!selectedDisposable && !selectedLiquid && !selectedPatch"
            @click="saveSelection"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import vapeProductsData from '../data/vape-products-scraped.json';

const $q = useQuasar();

interface Product {
  imageUrl: string;
  price: string;
  name: string;
}

const selectedDisposable = ref<Product | null>(null);
const selectedLiquid = ref<Product | null>(null);
const selectedPatch = ref<Product | null>(null);

// Read in vape product json and combine all brands into one array
const allProducts = [
  ...vapeProductsData.IVG,
  ...vapeProductsData.ELF,
  ...vapeProductsData['LOST MARY'],
  ...vapeProductsData.VUSE,
  ...vapeProductsData.OTHER,
];

// Get disposable products from disposable vape JSON
const disposableOptions = ref<Product[]>(allProducts);

// Dummy arrays for other dropdowns
const liquidOptions = ref<Product[]>([]);
const patchOptions = ref<Product[]>([]);

const saveSelection = () => {
  const selection = {
    disposable: selectedDisposable.value,
    liquid: selectedLiquid.value,
    patch: selectedPatch.value,
  };

  console.log('Selected products:', selection);

  $q.notify({
    color: 'positive',
    message: 'Product selection saved successfully!',
    icon: 'check_circle',
    position: 'top',
  });
};
</script>
