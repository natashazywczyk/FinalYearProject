<template>
  <q-page class="px-6 py-8" :class="$q.dark.isActive ? 'bg-gray-900' : 'bg-gray-100'">
    <div class="max-w-5xl mx-auto">
      <router-link
        to="/dashboard"
        class="inline-flex items-center gap-1 text-sm font-medium mb-6"
        :class="
          $q.dark.isActive ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
        "
      >
        <span class="material-icons text-base">arrow_back</span>
        Back
      </router-link>

      <div
        class="text-3xl font-bold mb-2"
        :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
      >
        Log Craving Level
      </div>
      <div class="text-sm mb-8" :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'">
        Track how strong your cravings are each day.
      </div>

      <!-- Log craving -->
      <div
        v-if="!hasLoggedCraving && !isLoading"
        class="rounded-xl p-6 border mb-6"
        :class="
          $q.dark.isActive ? 'bg-gray-800/50 border-white/10' : 'bg-white border-gray-200 shadow-sm'
        "
      >
        <div
          class="text-xl font-semibold text-center mb-6"
          :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
        >
          How strong were your cravings today?
        </div>

        <!-- Craving Levels -->
        <div class="flex items-center justify-center gap-4 mb-6">
          <span class="text-sm" :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'"
            >None</span
          >
          <div class="flex gap-4">
            <div
              v-for="level in 5"
              :key="level"
              class="text-center cursor-pointer"
              @click="cravingLevel = level"
            >
              <div class="craving-icon-container" :class="{ selected: cravingLevel === level }">
                <q-icon
                  :name="getCravingIcon(level)"
                  :color="cravingLevel === level ? getCravingColor(level) : 'grey-5'"
                  size="60px"
                />
              </div>
            </div>
          </div>
          <span class="text-sm" :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'"
            >Strong</span
          >
        </div>

        <div class="flex justify-center">
          <button
            @click="submitCravingLevel"
            class="rounded-md bg-[#775AB8] px-6 py-2 text-sm font-semibold text-white hover:bg-[#6B51A6]"
          >
            Submit
          </button>
        </div>
      </div>

      <transition name="fade">
        <div
          v-if="showSubmitted && !editing"
          class="rounded-xl p-6 border mb-6 text-center"
          :class="
            $q.dark.isActive
              ? 'bg-gray-800/50 border-white/10'
              : 'bg-white border-gray-200 shadow-sm'
          "
        >
          <div
            class="text-xl font-semibold mb-2"
            :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
          >
            Thank you for logging your craving!
          </div>
          <div class="text-sm mb-4" :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'">
            Your progress has been recorded.
          </div>
          <button
            @click="enableEditing"
            class="inline-flex items-center gap-1 text-sm font-medium text-[#775AB8] hover:text-[#6B51A6]"
          >
            <span class="material-icons text-base">edit</span>
            Edit
          </button>
        </div>
      </transition>

      <!-- Edit -->
      <div
        v-if="editing && !isLoading"
        class="rounded-xl p-6 border mb-6"
        :class="
          $q.dark.isActive ? 'bg-gray-800/50 border-white/10' : 'bg-white border-gray-200 shadow-sm'
        "
      >
        <div
          class="text-xl font-semibold text-center mb-6"
          :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
        >
          Update your craving level for today
        </div>

        <div class="flex items-center justify-center gap-4 mb-6">
          <span class="text-sm" :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'"
            >None</span
          >
          <div class="flex gap-4">
            <div
              v-for="level in 5"
              :key="level"
              class="text-center cursor-pointer"
              @click="cravingLevel = level"
            >
              <div class="craving-icon-container" :class="{ selected: cravingLevel === level }">
                <q-icon
                  :name="getCravingIcon(level)"
                  :color="cravingLevel === level ? getCravingColor(level) : 'grey-5'"
                  size="60px"
                />
              </div>
            </div>
          </div>
          <span class="text-sm" :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'"
            >Strong</span
          >
        </div>

        <div class="flex justify-center gap-3">
          <button
            @click="cancelEditing"
            class="rounded-md border px-6 py-2 text-sm font-semibold transition-colors"
            :class="
              $q.dark.isActive
                ? 'border-white/10 text-gray-300 hover:bg-white/10'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            "
          >
            Cancel
          </button>
          <button
            @click="submitCravingLevel"
            class="rounded-md bg-[#775AB8] px-6 py-2 text-sm font-semibold text-white hover:bg-[#6B51A6]"
          >
            Update
          </button>
        </div>
      </div>

      <!-- Apex Chart -->
      <transition name="fade-delayed">
        <div
          v-if="showChart"
          class="rounded-xl p-6 border"
          :class="
            $q.dark.isActive
              ? 'bg-gray-800/50 border-white/10'
              : 'bg-white border-gray-200 shadow-sm'
          "
        >
          <div class="flex items-center justify-between mb-4">
            <div
              class="text-lg font-semibold"
              :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
            >
              {{ timePeriod }} Craving Trend
            </div>
            <q-select
              v-model="timePeriod"
              :options="timePeriodOptions"
              outlined
              dense
              style="min-width: 150px"
              @update:model-value="updateChartData"
            />
          </div>
          <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
        </div>
      </transition>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center items-center" style="min-height: 400px">
        <q-spinner color="primary" size="50px" />
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
