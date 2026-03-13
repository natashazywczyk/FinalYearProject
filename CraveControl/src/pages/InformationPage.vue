<template>
  <q-page class="px-6 py-8" :class="$q.dark.isActive ? 'bg-gray-900' : 'bg-gray-100'">
    <div class="max-w-5xl mx-auto">
      <template v-if="pageReady">
        <router-link
          to="/dashboard"
          class="inline-flex items-center gap-1 text-sm font-medium mb-6"
          :class="
            $q.dark.isActive
              ? 'text-gray-400 hover:text-white'
              : 'text-gray-500 hover:text-gray-900'
          "
        >
          <span class="material-icons text-base">arrow_back</span>
          Back
        </router-link>

        <div
          class="text-3xl font-bold mb-2"
          :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
        >
          Information
        </div>
        <div class="text-sm mb-8" :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'">
          Discover tips and strategies to manage your cravings
        </div>

        <!-- Poll trigger -->
        <div
          class="rounded-xl p-6 border mb-6"
          :class="
            $q.dark.isActive
              ? 'bg-gray-800/50 border-white/10'
              : 'bg-white border-gray-200 shadow-sm'
          "
        >
          <button
            class="poll-link text-sm font-semibold text-[#775AB8] hover:text-[#6B51A6]"
            @click="pollDialog = true"
          >
            Take a quick poll about your disposal habits
          </button>
          <span
            v-if="userHabit"
            class="q-ml-sm text-caption"
            :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'"
          >
            (Your answer: <strong>{{ habitLabel(userHabit) }}</strong
            >)
          </span>
        </div>

        <!-- Age group disposal stats -->
        <div v-if="ageGroupStats.length" class="q-mb-xl">
          <div
            class="text-xl font-semibold mb-2"
            :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
          >
            Disposal Habits by Age Group
          </div>
          <div class="text-sm mb-4" :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'">
            Based on responses from other users:
          </div>
          <div class="row justify-center q-gutter-sm">
            <div v-for="stat in ageGroupStats" :key="stat.ageGroup" class="col-12 col-sm-auto">
              <q-card
                flat
                bordered
                style="min-width: 160px"
                :class="
                  $q.dark.isActive
                    ? 'bg-gray-800/50 border-white/10'
                    : 'bg-white border-gray-200 shadow-sm'
                "
              >
                <q-card-section class="q-pa-sm text-center">
                  <div
                    class="text-subtitle2 text-weight-bold"
                    :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
                  >
                    {{ stat.ageGroup }}
                  </div>
                  <div
                    class="text-caption q-mt-xs"
                    :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'"
                  >
                    Always: {{ stat.always }} &nbsp;|&nbsp; Sometimes:
                    {{ stat.sometimes }} &nbsp;|&nbsp; Rarely: {{ stat.rarely }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="flex justify-center items-center" style="min-height: 400px">
        <q-spinner color="primary" size="50px" />
      </div>
    </div>

    <!-- Poll dialog -->
    <q-dialog v-model="pollDialog" persistent>
      <q-card style="min-width: 320px; max-width: 420px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Disposing Poll</div>
          <div class="text-caption opacity-80">Responses are anonymous</div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle1 q-mb-md text-weight-medium">
            Do you responsibly dispose of your nicotine products?
          </div>
          <q-list>
            <q-item
              v-for="opt in pollOptions"
              :key="opt.value"
              clickable
              :active="selectedHabit === opt.value"
              active-class="bg-primary-light text-primary"
              class="rounded-borders q-mb-xs"
              @click="selectedHabit = opt.value"
            >
              <q-item-section avatar>
                <q-radio v-model="selectedHabit" :val="opt.value" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ opt.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn
            flat
            label="Cancel"
            color="grey"
            v-close-popup
            @click="selectedHabit = userHabit"
          />
          <q-btn
            label="Submit"
            color="primary"
            :disable="!selectedHabit"
            :loading="saving"
            unelevated
            @click="submitPoll"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { supabase } from 'src/boot/supabase';

const $q = useQuasar();

const pollDialog = ref(false);
const saving = ref(false);
const pageReady = ref(false);
const selectedHabit = ref<'always' | 'sometimes' | 'rarely' | null>(null);
const userHabit = ref<'always' | 'sometimes' | 'rarely' | null>(null);

const MIN_PAGE_LOAD_MS = 350;

interface AgeGroupStat {
  ageGroup: string;
  always: number;
  sometimes: number;
  rarely: number;
}

const ageGroupStats = ref<AgeGroupStat[]>([]);

const pollOptions = [
  {
    value: 'always' as const,
    label: 'Always',
  },
  {
    value: 'sometimes' as const,
    label: 'Sometimes',
  },
  {
    value: 'rarely' as const,
    label: 'Rarely',
  },
];

function habitLabel(val: string | null) {
  return pollOptions.find((o) => o.value === val)?.label ?? val;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadUserHabit() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const { data } = await supabase
    .from('account')
    .select('disposal_habit')
    .eq('user_id', user.id)
    .single();
  if (data?.disposal_habit) {
    userHabit.value = data.disposal_habit as 'always' | 'sometimes' | 'rarely';
    selectedHabit.value = userHabit.value;
  }
}

const ALL_AGE_GROUPS = ['Under 18', '18-25', '25-30', '31-40', '41-50', '60+'];

async function loadAgeGroupStats() {
  const { data, error } = await supabase.rpc('get_disposal_habit_stats');

  if (error) return;

  // Start with zeros for every known age group
  const counts = Object.fromEntries(
    ALL_AGE_GROUPS.map((g) => [g, { ageGroup: g, always: 0, sometimes: 0, rarely: 0 }]),
  );

  for (const row of data ?? []) {
    const entry = counts[row.age_group as string];
    if (entry) {
      entry.always = Number(row.always);
      entry.sometimes = Number(row.sometimes);
      entry.rarely = Number(row.rarely);
    }
  }

  ageGroupStats.value = Object.values(counts);
}

async function submitPoll() {
  if (!selectedHabit.value) return;
  saving.value = true;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('account')
      .update({ disposal_habit: selectedHabit.value })
      .eq('user_id', user.id);

    if (error) throw error;

    userHabit.value = selectedHabit.value;
    pollDialog.value = false;
    await loadAgeGroupStats();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Could not save your response';
    $q.notify({ type: 'negative', message: msg, position: 'top' });
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  await Promise.all([loadUserHabit(), loadAgeGroupStats(), delay(MIN_PAGE_LOAD_MS)]);
  pageReady.value = true;
});
</script>

<style scoped>
.poll-link {
  text-decoration: underline dotted;
  transition: opacity 0.15s;
}
.poll-link:hover {
  opacity: 0.75;
}
</style>
