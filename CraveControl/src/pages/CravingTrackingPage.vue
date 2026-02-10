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
          <q-card flat bordered class="q-mb-lg" v-if="showSubmitted && !editing">
            <q-card-section class="text-center">
              <div class="text-h5 q-mb-md">Thank you for logging your craving!</div>
              <div class="text-body1 text-grey-7">Your progress has been recorded.</div>
              <div class="q-mt-md">
                <q-btn flat color="primary" label="Edit" icon="edit" @click="enableEditing" />
              </div>
            </q-card-section>
          </q-card>
        </transition>

        <!-- Edit -->
        <q-card flat bordered class="q-mb-lg" v-if="editing && !isLoading">
          <q-card-section>
            <div class="text-h5 q-mb-lg text-center">Update your craving level for today</div>

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

            <div class="row justify-center q-mt-lg q-col-gutter-sm">
              <div class="col-auto">
                <q-btn flat label="Cancel" @click="cancelEditing" style="min-width: 150px" />
              </div>
              <div class="col-auto">
                <q-btn
                  color="primary"
                  label="Update"
                  @click="submitCravingLevel"
                  unelevated
                  style="min-width: 150px"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <transition name="fade-delayed">
          <q-card flat bordered v-if="showChart">
            <q-card-section>
              <div class="row items-center justify-between q-mb-md">
                <div class="text-h6">{{ timePeriod }} Craving Trend</div>
                <q-select
                  v-model="timePeriod"
                  :options="timePeriodOptions"
                  outlined
                  dense
                  style="min-width: 150px"
                  @update:model-value="updateChartData"
                />
              </div>
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
const cravingLevel = ref<number | null>(null);
const hasLoggedCraving = ref(false);
const showSubmitted = ref(false);
const showChart = ref(false);
const isLoading = ref(true);
const editing = ref(false);
const originalCravingLevel = ref<number | null>(null);
const timePeriod = ref('This Week');
const timePeriodOptions = ['This Week', 'Last Week', 'Last Month'];

// Chart data
const series = ref([
  {
    name: 'Craving Level',
    data: [] as (number | null)[],
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
    curve: 'straight' as const,
    width: 5,
  },
  colors: ['#1976D2'],
  xaxis: {
    categories: [] as string[],
  },
  yaxis: {
    min: 1,
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

const updateChartData = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date();
    let startDate: Date;
    let endDate: Date = new Date(today);
    let categories: string[];

    if (timePeriod.value === 'This Week') {
      // Get current week trackings
      const dayOfWeek = today.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Make sure starts on Monday
      startDate = new Date(today);
      startDate.setDate(today.getDate() + diff);
      categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else if (timePeriod.value === 'Last Week') {
      // Get last week trackings
      const dayOfWeek = today.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      startDate = new Date(today);
      startDate.setDate(today.getDate() + diff - 7);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else {
      // Get last 30 day trackings
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 29);
      categories = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        categories.push(`${date.getMonth() + 1}/${date.getDate()}`);
      }
    }

    // Get craving level from database
    const { data: cravings } = await supabase
      .from('craving_level')
      .select('date, level')
      .eq('user_id', user.id)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    // Array matching categories in database
    const dataMap = new Map(cravings?.map((c) => [c.date, c.level]) || []);
    const chartData: (number | null)[] = [];

    if (timePeriod.value === 'Last Month') {
      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        chartData.push(dataMap.get(dateStr) || null);
      }
    } else {
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        chartData.push(dataMap.get(dateStr) || null);
      }
    }

    // Update chart
    chartOptions.value = {
      ...chartOptions.value,
      xaxis: {
        ...chartOptions.value.xaxis,
        categories: categories,
      },
    };
    series.value = [
      {
        name: 'Craving Level',
        data: chartData,
      },
    ];
  } catch (error) {
    console.error('Error fetching chart data:', error);
  }
};

const submitCravingLevel = async () => {
  if (!cravingLevel.value) {
    $q.notify({
      type: 'warning',
      message: 'Please select a craving level',
    });
    return;
  }

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

  // Show chart with the new entry
  await updateChartData();

  // If editing, just update and show confirmation
  if (editing.value) {
    editing.value = false;
    originalCravingLevel.value = cravingLevel.value;
    $q.notify({
      type: 'positive',
      message: `Craving level updated to ${cravingLevel.value}!`,
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

const enableEditing = () => {
  editing.value = true;
  originalCravingLevel.value = cravingLevel.value;
};

const cancelEditing = () => {
  editing.value = false;
  cravingLevel.value = originalCravingLevel.value;
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
        originalCravingLevel.value = todayLog.level;

        // Show final screen with chart
        setTimeout(() => {
          showSubmitted.value = true;
        }, 100);

        setTimeout(() => {
          showChart.value = true;
        }, 400);
      }

      // Load chart
      await updateChartData();
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
