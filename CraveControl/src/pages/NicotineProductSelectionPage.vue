<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-10">
        <q-btn flat icon="arrow_back" label="Back" to="/dashboard" class="q-mb-md" />

        <div class="text-h4 q-mb-md text-center">Nicotine Product Selection</div>
        <div class="text-subtitle1 q-mb-lg text-grey-7 text-center">
          Find the product you use or are thinking/thought of buying
        </div>

        <!-- Select Product Type -->
        <div v-if="currentStep === 1" class="q-mt-lg">
          <div class="text-h6 q-mb-md text-center">What type of product do you use?</div>
          <div class="row q-col-gutter-md justify-center">
            <div class="col-12 col-sm-4" v-for="type in productTypes" :key="type.value">
              <q-card
                class="cursor-pointer transition hover-card"
                :class="{ 'selected-card': selectedProductType === type.value }"
                @click="selectProductType(type.value)"
              >
                <q-card-section class="text-center q-pa-lg">
                  <div class="text-h6">{{ type.label }}</div>
                  <div class="text-caption text-grey-7">{{ type.description }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <!-- Select Brand -->
        <div v-if="currentStep === 2" class="q-mt-lg">
          <div class="row items-center q-mb-md">
            <q-btn flat icon="arrow_back" @click="currentStep = 1" />
            <div class="text-h6 text-center col">Which brand do you prefer?</div>
          </div>
          <div class="row q-col-gutter-sm justify-center">
            <div class="col-6 col-sm-4 col-md-3" v-for="brand in availableBrands" :key="brand">
              <q-btn
                :label="brand"
                :outline="selectedBrand !== brand"
                :color="selectedBrand === brand ? 'primary' : 'grey-7'"
                class="full-width"
                size="lg"
                @click="selectBrand(brand)"
              />
            </div>
          </div>
        </div>

        <!-- Select Product -->
        <div v-if="currentStep === 3" class="q-mt-lg">
          <div class="relative-position q-mb-md">
            <q-btn flat icon="arrow_back" @click="currentStep = 2" class="absolute-left" />
            <div class="text-h6 text-center">Select your {{ selectedProductType }}</div>
          </div>
          <div class="text-subtitle2 q-mb-lg text-grey-7 text-center">
            Brand: {{ selectedBrand }}
          </div>

          <div class="row q-col-gutter-md">
            <div
              class="col-12 col-sm-6 col-md-4"
              v-for="product in filteredProducts"
              :key="product.name"
            >
              <q-card
                class="cursor-pointer product-card"
                :class="{ 'selected-card': selectedProduct?.name === product.name }"
                @click="selectProduct(product)"
              >
                <q-card-section class="text-center relative-position">
                  <div class="product-image-container">
                    <q-img
                      v-if="product.imageUrl"
                      :src="product.imageUrl"
                      style="height: 150px"
                      fit="contain"
                      class="q-mb-md"
                    />
                    <div v-if="selectedProduct?.name === product.name" class="product-overlay">
                      <q-btn color="primary" label="Save" size="lg" @click.stop="saveSelection" />
                    </div>
                  </div>
                  <div class="text-subtitle1">{{ product.name }}</div>
                  <div class="text-h6 text-primary q-mt-sm">€{{ product.price }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.hover-card {
  transition: all 0.3s ease;
}

.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.selected-card {
  border: 2px solid var(--q-primary);
  box-shadow: 0 4px 12px rgba(var(--q-primary-rgb), 0.3);
}

.product-card {
  transition: all 0.2s ease;
  height: 100%;
}

.product-card:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.product-image-container {
  position: relative;
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import disposablesData from '../data/vape-disposables-scraped.json';
import liquidsData from '../data/vape-liquids-scraped.json';
import pouchesData from '../data/pouches-scraped.json';

const $q = useQuasar();

interface Product {
  imageUrl: string;
  price: string;
  name: string;
}

const currentStep = ref(1); // Tracks steps
const selectedProductType = ref<string | null>(null);
const selectedBrand = ref<string | null>(null);
const selectedProduct = ref<Product | null>(null);

// Product types
const productTypes = [
  {
    value: 'disposables',
    label: 'Disposables',
    description: 'Disposable vapes',
  },
  {
    value: 'liquids',
    label: 'E-Liquids',
    description: 'Vape juice & e-liquids',
  },
  {
    value: 'pouches',
    label: 'Nicotine Pouches',
    description: 'Tobacco-free pouches',
  },
];

// Products organized by type and brand
const productData = {
  disposables: disposablesData,
  liquids: liquidsData,
  pouches: pouchesData,
};

// Get brands for selected type
const availableBrands = computed(() => {
  if (!selectedProductType.value) return [];
  const data = productData[selectedProductType.value as keyof typeof productData];
  return Object.keys(data).filter((brand) => data[brand as keyof typeof data].length > 0); // Use only brands with products
});

// Get selected brand products
const filteredProducts = computed(() => {
  if (!selectedProductType.value || !selectedBrand.value) return [];
  const data = productData[selectedProductType.value as keyof typeof productData]; // Ensure that there are products
  return data[selectedBrand.value as keyof typeof data] || []; // Return products for selected brand
});

const selectProductType = (type: string) => {
  selectedProductType.value = type;
  selectedBrand.value = null;
  selectedProduct.value = null;
  currentStep.value = 2;
};

const selectBrand = (brand: string) => {
  selectedBrand.value = brand;
  selectedProduct.value = null;
  currentStep.value = 3;
};

const selectProduct = (product: Product) => {
  selectedProduct.value = product;
};

const saveSelection = () => {
  const selection = {
    productType: selectedProductType.value,
    brand: selectedBrand.value,
    product: selectedProduct.value,
  };

  console.log('Selected product:', selection);

  $q.notify({
    color: 'positive',
    message: 'Product selection saved successfully!',
    icon: 'check_circle',
    position: 'top',
  });
};
</script>
