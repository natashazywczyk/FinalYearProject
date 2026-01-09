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
            <div class="text-h6 q-mb-md">Today's Craving Level</div>
            <div class="text-subtitle2 q-mb-md">Select today's craving level:</div>

            <div class="row q-col-gutter-sm q-mb-md">
              <div class="col" v-for="level in 5" :key="level">
                <q-btn
                  :outline="cravingLevel !== level"
                  :unelevated="cravingLevel === level"
                  :color="cravingLevel === level ? 'primary' : 'grey-5'"
                  :label="`Level ${level}`"
                  @click="cravingLevel = level"
                  class="full-width"
                  size="lg"
                />
              </div>
            </div>

            <div class="text-caption text-grey-7 q-mb-md">
              Level 1 = Low/No craving, Level 5 = High craving
            </div>

            <div class="row justify-center">
              <q-btn color="primary" label="Submit" @click="submitCravingLevel" unelevated style="min-width: 200px;" />
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
const series = ref([{
  name: 'Craving Level',
  data: [4, 3, 5, 2, 1, 2, 3]
}]);

const chartOptions = ref({
  chart: {
    type: 'line',
    toolbar: {
      show: false
    }
  },
  stroke: {
    curve: 'straight',
    width: 3
  },
  colors: ['#1976D2'],
  xaxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yaxis: {
    min: 0,
    max: 5,
    title: {
      text: 'Craving Level'
    }
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return val.toString();
      }
    }
  }
});

const submitCravingLevel = () => {
  $q.notify({
    type: 'positive',
    message: `Craving level ${cravingLevel.value} submitted!`
  });
};
</script>
