<template>
  <q-page class="q-pa-md">
    <div class="row q-mb-md">
      <div class="col-12">
        <div class="text-h4 q-mb-md">
          <q-icon name="shopping_cart" />
          Vaping Products
        </div>
        <div class="text-subtitle1 text-grey-7">
          Product information to help you understand the costs and make informed decisions
        </div>
      </div>
    </div>

    <div class="row q-mb-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Scrape Products</div>
            <div class="text-caption text-grey-7">
              Enter a URL to scrape vaping product information, or use mock data
            </div>
          </q-card-section>
          
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-8">
                <q-input
                  v-model="scrapeUrl"
                  outlined
                  label="Product URL"
                  placeholder="https://example.com/products/vaping"
                  :disable="loading"
                >
                  <template v-slot:prepend>
                    <q-icon name="link" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-4">
                <q-btn
                  label="Scrape URL"
                  color="primary"
                  @click="scrapeFromUrl"
                  :loading="loading"
                  :disable="!scrapeUrl"
                  class="full-width"
                  icon="search"
                />
              </div>
            </div>
            <div class="q-mt-md">
              <q-btn
                label="Load Sample Products"
                color="secondary"
                @click="loadMockProducts"
                :loading="loading"
                outline
                icon="cloud_download"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div v-if="products.length > 0" class="row q-col-gutter-md">
      <div v-for="(product, index) in products" :key="index" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="product-card">
          <q-img
            :src="product.image || 'https://via.placeholder.com/300x300?text=No+Image'"
            :ratio="1"
            spinner-color="primary"
          >
            <div class="absolute-bottom text-subtitle2 text-center">
              {{ product.title }}
            </div>
          </q-img>

          <q-card-section>
            <div class="text-h6 text-primary">
              {{ product.price !== 'N/A' ? '£' + product.price : 'Price not available' }}
            </div>
            <div class="text-caption text-grey-7">
              Scraped: {{ formatDate(product.scrapedAt) }}
            </div>
          </q-card-section>

          <q-card-actions v-if="product.url">
            <q-btn
              flat
              color="primary"
              label="View Source"
              icon="open_in_new"
              size="sm"
              :href="product.url"
              target="_blank"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div v-else-if="!loading" class="text-center q-pa-xl">
      <q-icon name="inbox" size="100px" color="grey-5" />
      <div class="text-h6 text-grey-7 q-mt-md">
        No products loaded yet
      </div>
      <div class="text-caption text-grey-6">
        Use the scraper above to load product information
      </div>
    </div>

    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots size="50px" color="primary" />
      <div class="text-h6 text-grey-7 q-mt-md">
        Loading products...
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { Notify } from 'quasar'
import scraperService from '../services/scraperService'

export default {
  name: 'ProductsPage',
  setup() {
    const products = ref([])
    const loading = ref(false)
    const scrapeUrl = ref('')

    const loadMockProducts = async () => {
      loading.value = true
      try {
        const mockProducts = await scraperService.getMockProducts()
        products.value = mockProducts
        
        Notify.create({
          type: 'positive',
          message: `Loaded ${mockProducts.length} sample products`
        })
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: 'Error loading products: ' + error.message
        })
      } finally {
        loading.value = false
      }
    }

    const scrapeFromUrl = async () => {
      loading.value = true
      try {
        // Try to scrape the URL
        // Note: This might not work in browser due to CORS restrictions
        // In production, this should be done via a backend API
        const product = await scraperService.scrapeProduct(scrapeUrl.value)
        products.value = [product, ...products.value]
        
        Notify.create({
          type: 'positive',
          message: 'Product scraped successfully!'
        })
      } catch (error) {
        Notify.create({
          type: 'warning',
          message: 'Direct scraping blocked by CORS. Use a backend API or try sample data.',
          timeout: 5000
        })
        console.error('Scraping error:', error)
      } finally {
        loading.value = false
      }
    }

    const formatDate = (dateStr) => {
      if (!dateStr) return 'Unknown'
      const date = new Date(dateStr)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    }

    return {
      products,
      loading,
      scrapeUrl,
      loadMockProducts,
      scrapeFromUrl,
      formatDate
    }
  }
}
</script>

<style scoped>
.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
