<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h5">
              <q-icon name="waving_hand" />
              Welcome to CraveControl
            </div>
            <div class="text-subtitle2 text-grey-7">
              Your journey to quit vaping starts here
            </div>
          </q-card-section>

          <q-card-section>
            <p>
              CraveControl helps you quit vaping through:
            </p>
            <ul>
              <li><strong>Financial Motivation:</strong> Track how much money you save by not buying vaping products</li>
              <li><strong>Craving Visualization:</strong> Monitor your cravings and progress through interactive graphs</li>
              <li><strong>Product Awareness:</strong> View vaping product information to stay informed</li>
            </ul>
          </q-card-section>

          <q-card-actions>
            <q-btn
              label="View Vaping Products"
              color="primary"
              @click="$router.push('/products')"
              icon="shopping_cart"
            />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Quick Stats</div>
          </q-card-section>
          <q-card-section>
            <div class="q-gutter-sm">
              <div class="row items-center">
                <q-icon name="savings" size="md" color="green" class="q-mr-md" />
                <div>
                  <div class="text-caption text-grey-7">Money Saved</div>
                  <div class="text-h6">£0.00</div>
                </div>
              </div>
              <q-separator />
              <div class="row items-center">
                <q-icon name="event" size="md" color="blue" class="q-mr-md" />
                <div>
                  <div class="text-caption text-grey-7">Days Smoke-Free</div>
                  <div class="text-h6">0</div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Motivation</div>
          </q-card-section>
          <q-card-section>
            <q-icon name="format_quote" size="sm" color="grey-5" />
            <p class="q-ma-sm">
              "The secret of getting ahead is getting started."
            </p>
            <div class="text-right text-grey-7">- Mark Twain</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'IndexPage'
}
</script>
