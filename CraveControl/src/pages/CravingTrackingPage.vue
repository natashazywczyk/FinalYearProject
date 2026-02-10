<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-10">
        <q-btn flat icon="arrow_back" label="Back" to="/dashboard" class="q-mb-md" />

        <div class="text-h4 q-mb-md">Log Craving Level</div>
        <div class="text-subtitle1 q-mb-lg text-grey-7">
          Track how strong your cravings are each day.
        </div>

        <q-card flat bordered class="q-mb-lg" v-if="!hasLoggedCraving && !isLoading">
          <q-card-section>
            <div class="text-h5 q-mb-lg text-center">How strong were your cravings today?</div>

            <div
              class="row items-center justify-center q-mb-lg"
              style="max-width: 700px; margin: 0 auto"
            >
              <div class="text-subtitle1 text-grey-7 q-mr-md">None</div>
              <div class="row justify-center q-col-gutter-md" style="flex: 0 0 auto">
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
              <div class="text-subtitle1 text-grey-7 q-ml-md">Strong</div>
            </div>

            <div class="row justify-center q-mt-lg">
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

        <transition name="fade">
          <q-card flat bordered class="q-mb-lg" v-if="showSubmitted">
            <q-card-section class="text-center">
              <div class="text-h5 q-mb-md">Thank you for logging your craving!</div>
              <div class="text-body1 text-grey-7">Your progress has been recorded.</div>
              <div class="text-body1 text-grey-7">See your craving trends below!</div>
            </q-card-section>
          </q-card>
        </transition>

        <transition name="fade-delayed">
          <q-card flat bordered v-if="showChart">
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
        </transition>

        <!-- Loading -->
        <div v-if="isLoading" class="row justify-center items-center" style="min-height: 400px">
          <q-spinner color="primary" size="50px" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { supabase } from '../boot/supabase';

const $q = useQuasar();
const cravingLevel = ref(1); // Default to 1
const hasLoggedCraving = ref(false);
const showSubmitted = ref(false);
const showChart = ref(false);
const isLoading = ref(true);

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

const submitCravingLevel = async () => {
  hasLoggedCraving.value = true;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      // Save craving level to database
      await supabase.from('craving_level').upsert(
        {
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          level: cravingLevel.value,
        },
        {
          onConflict: 'user_id,date',
        },
      );
    }
  } catch (error) {
    console.error('Error saving craving level:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to save craving level',
    });
    return;
  }

  // Show thank you message with slight delay
  setTimeout(() => {
    showSubmitted.value = true;
  }, 300);

  // Show chart slightly after
  setTimeout(() => {
    showChart.value = true;
  }, 700);

  $q.notify({
    type: 'positive',
    message: `Craving level ${cravingLevel.value} submitted!`,
  });
};

onMounted(async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      // Check if user already logged craving level today
      const today = new Date().toISOString().split('T')[0];
      const { data: todayLog } = await supabase
        .from('craving_level')
        .select('level')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (todayLog) {
        // If user has already logged today
        hasLoggedCraving.value = true;
        cravingLevel.value = todayLog.level;

        // Show final screen with chart
        setTimeout(() => {
          showSubmitted.value = true;
        }, 100);

        setTimeout(() => {
          showChart.value = true;
        }, 400);
      }
    }
  } catch (error) {
    console.error('Error checking cravings:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.craving-icon-container {
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.craving-icon-container:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.craving-icon-container.selected {
  background-color: rgba(25, 118, 210, 0.1);
  border-color: #1976d2;
}

.fade-enter-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-to {
  opacity: 1;
}

.fade-delayed-enter-active {
  transition: opacity 1s ease;
}

.fade-delayed-enter-from {
  opacity: 0;
}

.fade-delayed-enter-to {
  opacity: 1;
}
</style>
