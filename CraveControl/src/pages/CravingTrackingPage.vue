<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-10">
        <q-btn flat icon="arrow_back" label="Back" to="/dashboard" class="q-mb-md" />

        <div class="text-h4 q-mb-md">Log Craving Level</div>
        <div class="text-subtitle1 q-mb-lg text-grey-7">
          Track how strong your cravings are each day.
        </div>

        <q-card flat bordered class="q-mb-lg">
          <q-card-section>
            <div class="text-h5 q-mb-lg text-center">How strong were your cravings today?</div>

            <div
              class="row justify-center q-col-gutter-md q-mb-lg"
              style="max-width: 600px; margin: 0 auto"
            >
              <div
                class="col-auto text-center"
                v-for="level in 5"
                :key="level"
                style="cursor: pointer"
              >
                <div
                  @click="cravingLevel = level"
                  class="craving-icon-container"
                  :class="{ selected: cravingLevel === level }"
                >
                  <q-icon
                    :name="getCravingIcon(level)"
                    :color="cravingLevel === level ? getCravingColor(level) : 'grey-5'"
                    size="60px"
                  />
                </div>
              </div>
            </div>

            <div class="row justify-center">
              <q-btn
                color="primary"
                label="Submit"
                @click="submitCravingLevel"
                unelevated
                style="min-width: 200px"
              />
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6 q-mb-md">This Week's Craving Trend</div>
            <apexchart
              type="line"
              height="350"
              :options="chartOptions"
              :series="series"
            ></apexchart>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const cravingLevel = ref(1); // Default to 1

// Example data for demo
const series = ref([
  {
    name: 'Craving Level',
    data: [4, 3, 5, 2, 1, 2, 3],
  },
]);

const chartOptions = ref({
  chart: {
    type: 'line',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  stroke: {
    curve: 'straight',
    width: 3,
  },
  colors: ['#1976D2'],
  xaxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yaxis: {
    min: 0,
    max: 5,
    title: {
      text: 'Craving Level',
    },
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return val.toString();
      },
    },
  },
});

const getCravingIcon = (level: number) => {
  const icons = [
    'sentiment_very_satisfied',
    'sentiment_satisfied',
    'sentiment_neutral',
    'sentiment_dissatisfied',
    'sentiment_very_dissatisfied',
  ];
  return icons[level - 1];
};

const getCravingColor = (level: number) => {
  const colors = ['green', 'light-green', 'orange', 'deep-orange', 'red'];
  return colors[level - 1];
};

const submitCravingLevel = () => {
  $q.notify({
    type: 'positive',
    message: `Craving level ${cravingLevel.value} submitted!`,
  });
};
</script>

<style scoped>
.craving-icon-container {
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s;
}

.craving-icon-container:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.craving-icon-container.selected {
  background-color: rgba(25, 118, 210, 0.1);
  border: 2px solid #1976d2;
}
</style>
