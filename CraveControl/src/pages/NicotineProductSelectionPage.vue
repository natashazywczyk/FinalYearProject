<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-10">
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
                  <q-item-section avatar v-if="scope.opt.picture">
                    <q-avatar rounded>
                      <img :src="getPictureUrl(scope.opt.picture)" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.price }}</q-item-label>
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
                    v-if="selectedDisposable.picture"
                    :src="getPictureUrl(selectedDisposable.picture)"
                    style="max-width: 150px; max-height: 150px;"
                    class="q-mb-md"
                  />
                  <div class="text-subtitle1">{{ selectedDisposable.name }}</div>
                  <div class="text-h6 text-primary q-mt-sm">{{ selectedDisposable.price }}</div>
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
import vapeProductsData from '../data/demo-vape-product-scrape.json';

const $q = useQuasar();

interface Product {
  picture: string;
  price: string;
  name: string;
}

const selectedDisposable = ref<Product | null>(null);
const selectedLiquid = ref<Product | null>(null);
const selectedPatch = ref<Product | null>(null);

// Read in vape product json
const processedProducts = vapeProductsData
  .filter((product, index, self) =>
    index === self.findIndex(p => p.name === product.name)
  )
  .map(product => ({
    ...product,
    picture: product.picture.startsWith('[')
      ? JSON.parse(product.picture)[0]
      : product.picture
  }));

// Get disposable products from disposable vape JSON
const disposableOptions = ref<Product[]>(processedProducts);

// Dummy arrays for other dropdowns
const liquidOptions = ref<Product[]>([]);
const patchOptions = ref<Product[]>([]);

// Function to extract image URL
const getPictureUrl = (picture: string): string => {
  if (picture.startsWith('["') && picture.endsWith('"]')) {
    return JSON.parse(picture)[0];
  } else if (picture.startsWith('[') && picture.endsWith(']')) {
    try {
      return JSON.parse(picture)[0];
    } catch {
      return picture;
    }
  }
  return picture;
};

const saveSelection = () => {
  const selection = {
    disposable: selectedDisposable.value,
    liquid: selectedLiquid.value,
    patch: selectedPatch.value
  };

  console.log('Selected products:', selection);

  $q.notify({
    color: 'positive',
    message: 'Product selection saved successfully!',
    icon: 'check_circle',
    position: 'top'
  });

};
</script>
