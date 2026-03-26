<template>
  <q-page class="px-6 py-8" :class="$q.dark.isActive ? 'bg-gray-900' : 'bg-gray-100'">
    <div class="max-w-7xl mx-auto">
      <router-link
        to="/dashboard"
        class="inline-flex items-center gap-1 text-sm font-medium mb-6"
        :class="$q.dark.isActive ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'"
      >
        <span class="material-icons text-base">arrow_back</span>
        Back
      </router-link>

      <div class="text-3xl font-bold mb-2" :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'">
        Nicotine Product Selection
      </div>
      <div class="text-sm mb-8" :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'">
        Find the product you use or are thinking/thought of buying
      </div>

      <!-- Select Product Type -->
      <div v-if="currentStep === 1">
        <div class="text-lg font-semibold text-center mb-6" :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'">
          What type of product do you use?
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            v-for="type in productTypes"
            :key="type.value"
            class="rounded-xl p-6 text-center border cursor-pointer transition-all duration-200 hover:-translate-y-1"
            :class="[
              $q.dark.isActive ? 'bg-gray-800/50 border-white/10 hover:bg-gray-700/50' : 'bg-white border-gray-200 shadow-sm hover:shadow-md',
              selectedProductType === type.value ? 'ring-2 ring-[#775AB8]' : ''
            ]"
            @click="selectProductType(type.value)"
          >
            <div class="font-semibold text-lg mb-1" :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'">
              {{ type.label }}
            </div>
            <div class="text-sm" :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'">
              {{ type.description }}
            </div>
          </div>
        </div>
      </div>

      <!-- Select Brand -->
      <div v-if="currentStep === 2">
        <div class="flex items-center gap-3 mb-6">
          <button
            @click="currentStep = 1"
            class="inline-flex items-center gap-1 text-sm font-medium"
            :class="$q.dark.isActive ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'"
          >
            <span class="material-icons text-base">arrow_back</span>
          </button>
          <div class="flex-1 text-center text-lg font-semibold" :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'">
            Which brand do you prefer?
          </div>
        </div>
        <div class="flex flex-wrap gap-3 justify-center">
          <button
            v-for="brand in availableBrands"
            :key="brand"
            @click="selectBrand(brand)"
            class="rounded-xl px-6 py-3 text-sm font-semibold border transition-all duration-200 hover:-translate-y-0.5"
            :class="selectedBrand === brand
              ? 'bg-[#775AB8] border-[#775AB8] text-white shadow-md'
              : $q.dark.isActive
                ? 'bg-gray-800/50 border-white/10 text-gray-300 hover:bg-gray-700/50'
                : 'bg-white border-gray-200 text-gray-700 shadow-sm hover:shadow-md'"
          >
            {{ brand }}
          </button>
        </div>
      </div>

      <!-- Select Product -->
      <div v-if="currentStep === 3">
        <div class="flex items-center gap-3 mb-2">
          <button
            @click="currentStep = 2"
            class="inline-flex items-center gap-1 text-sm font-medium"
            :class="$q.dark.isActive ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'"
          >
            <span class="material-icons text-base">arrow_back</span>
          </button>
          <div class="flex-1 text-center text-lg font-semibold" :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'">
            Select your {{ selectedProductType }}
          </div>
        </div>
        <div class="text-sm text-center mb-6" :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'">
          Brand: {{ selectedBrand }}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="product in filteredProducts"
            :key="product.name"
            class="rounded-xl border cursor-pointer transition-all duration-200 hover:scale-[1.02] overflow-hidden"
            :class="[
              $q.dark.isActive ? 'bg-gray-800/50 border-white/10' : 'bg-white border-gray-200 shadow-sm',
              selectedProduct?.name === product.name ? 'ring-2 ring-[#775AB8]' : ''
            ]"
            @click="selectProduct(product)"
          >
            <div class="p-4 text-center relative">
              <div class="relative">
                <q-img
                  v-if="product.imageUrl"
                  :src="product.imageUrl"
                  style="height: 150px"
                  fit="contain"
                  class="mb-3"
                />
                <div
                  v-if="selectedProduct?.name === product.name"
                  class="absolute inset-0 flex items-center justify-center mb-3"
                  :class="$q.dark.isActive ? 'bg-gray-900/80' : 'bg-white/85'"
                >
                  <button
                    @click.stop="saveSelection"
                    class="rounded-md bg-[#775AB8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6B51A6]"
                  >
                    Save
                  </button>
                </div>
              </div>
              <div class="font-medium text-sm" :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'">
                {{ product.name }}
              </div>
              <div class="text-[#775AB8] font-semibold mt-1">€{{ product.price }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { supabase } from '../boot/supabase';
import disposablesData from '../data/vape-disposables-scraped.json';
import liquidsData from '../data/vape-liquids-scraped.json';
import pouchesData from '../data/pouches-scraped.json';

const $q = useQuasar();
const router = useRouter();

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

const saveSelection = async () => {
  if (!selectedProduct.value) return;

  try {
    // Get the current user
    const {data: {user}} = await supabase.auth.getUser();

    // Add product to user profile
    const {error} = await supabase
      .from('account')
      .upsert({
        user_id: user!.id, // Skip null check as user has to already be logged in
        product_type: selectedProductType.value,
        product_brand: selectedBrand.value,
        product_name: selectedProduct.value.name,
        product_price: selectedProduct.value.price,
        product_image_url: selectedProduct.value.imageUrl,
      }, {
        onConflict: 'user_id'
      });

    if (error) throw error;

    $q.notify({
      color: 'positive',
      message: 'Product saved successfully!',
      icon: 'check_circle',
      position: 'top',
    });

    window.dispatchEvent(
      new CustomEvent('productUpdated', {
        detail: {
          productName: selectedProduct.value.name,
          productPrice: selectedProduct.value.price,
          productImageUrl: selectedProduct.value.imageUrl,
        }
      }),
    );

    // Redirect to dashboard
    router.push('/dashboard');
  } catch (error) {
    console.error('Error saving product:', error);
    $q.notify({
      color: 'negative',
      message: 'Failed to save product',
      icon: 'error',
      position: 'top',
    });
  }
};
</script>
