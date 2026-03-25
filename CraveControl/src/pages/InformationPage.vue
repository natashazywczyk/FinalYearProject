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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="stat in ageGroupStats"
              :key="stat.ageGroup"
              class="rounded-xl p-4 border text-center last:lg:col-start-2"
              :class="
                $q.dark.isActive
                  ? 'bg-gray-800/50 border-white/10'
                  : 'bg-white border-gray-200 shadow-sm'
              "
            >
              <div
                class="font-semibold text-base mb-2"
                :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
              >
                {{ stat.ageGroup }}
              </div>
              <div class="text-sm" :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'">
                Always: {{ stat.always }} &nbsp;|&nbsp; Sometimes:
                {{ stat.sometimes }} &nbsp;|&nbsp; Rarely: {{ stat.rarely }}
              </div>
            </div>
          </div>
        </div>

        <!-- Helpful links -->
        <div class="q-mt-xl">
          <div
            class="text-xl font-semibold"
            :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
          >
            Helpful links
          </div>

          <div class="q-mt-md q-gutter-y-lg">
            <div v-for="(section, i) in helpfulLinks" :key="i">
              <div
                class="text-base q-mb-sm"
                :class="$q.dark.isActive ? 'text-gray-300' : 'text-gray-700'"
              >
                {{ section.title }}
              </div>

              <div v-if="section.links" class="q-gutter-y-xs">
                <div
                  v-for="link in section.links"
                  :key="link.label"
                  class="flex items-center gap-3"
                >
                  <span
                    class="text-sm text-weight-medium"
                    style="min-width: 220px"
                    :class="$q.dark.isActive ? 'text-gray-300' : 'text-gray-700'"
                    >{{ link.label }}</span
                  >
                  <a
                    v-if="link.url"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-sm text-primary"
                    >{{ link.url }}</a
                  >
                </div>
              </div>

              <div v-if="section.subSections" class="q-gutter-y-sm">
                <div v-for="sub in section.subSections" :key="sub.label">
                  <div
                    class="text-sm text-weight-medium q-mb-xs"
                    :class="$q.dark.isActive ? 'text-gray-300' : 'text-gray-700'"
                  >
                    {{ sub.label }}
                  </div>
                  <div v-for="link in sub.links" :key="link.label" class="flex items-center gap-3">
                    <span
                      class="text-sm text-weight-medium"
                      style="min-width: 220px"
                      :class="$q.dark.isActive ? 'text-gray-300' : 'text-gray-700'"
                      >{{ link.label }}</span
                    >
                    <a
                      v-if="link.url"
                      :href="link.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-sm text-primary"
                      >{{ link.url }}</a
                    >
                  </div>
                </div>
              </div>
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
      <div
        class="rounded-xl border overflow-hidden w-full max-w-md min-w-80"
        :class="
          $q.dark.isActive
            ? 'bg-gray-800 border-white/10'
            : 'bg-white border-gray-200 shadow-lg'
        "
      >
        <!-- Header -->
        <div
          class="px-6 py-4 border-b"
          :class="
            $q.dark.isActive
              ? 'bg-gray-700/50 border-white/10'
              : 'bg-gray-50 border-gray-200'
          "
        >
          <div
            class="text-lg font-semibold"
            :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
          >
            Disposing Poll
          </div>
          <div
            class="text-sm"
            :class="$q.dark.isActive ? 'text-gray-400' : 'text-gray-500'"
          >
            Responses are anonymous
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 py-4">
          <div
            class="text-base font-medium mb-4"
            :class="$q.dark.isActive ? 'text-white' : 'text-gray-900'"
          >
            Do you responsibly dispose of your nicotine products?
          </div>
          <div class="space-y-2">
            <div
              v-for="opt in pollOptions"
              :key="opt.value"
              class="flex items-center p-3 rounded-lg cursor-pointer transition-colors"
              :class="
                selectedHabit === opt.value
                  ? $q.dark.isActive
                    ? 'bg-gray-700 text-white'
                    : 'bg-purple-50 text-purple-900'
                  : $q.dark.isActive
                    ? 'hover:bg-gray-700/50 text-gray-300'
                    : 'hover:bg-gray-50 text-gray-700'
              "
              @click="selectedHabit = opt.value"
            >
              <input
                type="radio"
                :value="opt.value"
                v-model="selectedHabit"
                class="w-4 h-4 cursor-pointer"
              />
              <label class="ml-3 cursor-pointer font-medium">{{ opt.label }}</label>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="px-6 py-4 border-t flex justify-end gap-3"
          :class="
            $q.dark.isActive
              ? 'bg-gray-700/30 border-white/10'
              : 'bg-gray-50 border-gray-200'
          "
        >
          <button
            @click="selectedHabit = userHabit; pollDialog = false"
            class="rounded-md px-3 py-1.5 text-sm/6 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9874C2]"
            :class="
              $q.dark.isActive
                ? 'text-gray-100 bg-white/10 hover:bg-white/20'
                : 'text-gray-900 bg-gray-200 hover:bg-gray-300'
            "
          >
            Cancel
          </button>
          <button
            @click="submitPoll"
            :disabled="!selectedHabit || saving"
            class="rounded-md bg-[#775AB8] px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-[#6B51A6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9874C2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ saving ? 'Submitting...' : 'Submit' }}
          </button>
        </div>
      </div>
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

interface LinkItem {
  label: string;
  url: string | null;
}

interface SubSection {
  label: string;
  links: LinkItem[];
}

interface LinkSection {
  title: string;
  links?: LinkItem[];
  subSections?: SubSection[];
}

const ageGroupStats = ref<AgeGroupStat[]>([]);

const helpfulLinks: LinkSection[] = [
  {
    title:
      'Below are some helpful links that provide further information about the effects of vaping:',
    links: [
      { label: 'HSE – Vaping', url: 'https://www2.hse.ie/living-well/quit-smoking/vaping/' },
      {
        label: 'HSE – Cravings & Withdrawal',
        url: 'https://www2.hse.ie/living-well/quit-smoking/get-help-to-quit/cravings-withdrawal/',
      },
      {
        label: 'HSE – Young People',
        url: 'https://www2.hse.ie/living-well/quit-smoking/other-products/young-people/',
      },
      {
        label: 'Citizens Information',
        url: 'https://www.citizensinformation.ie/en/health/health-services/addiction-treatment-services/help-to-stop-smoking-in-ireland/',
      },
      {
        label: 'NHS – Stop Smoking Services',
        url: 'https://www.nhs.uk/live-well/quit-smoking/nhs-stop-smoking-services-help-you-quit/',
      },
    ],
  },
  {
    title:
      'Below are some links that provide further information about the effects of nicotine pouches:',
    links: [
      {
        label: 'HSE – Smokeless Products',
        url: 'https://www2.hse.ie/living-well/quit-smoking/other-products/smokeless/',
      },
      {
        label: 'WebMD – Nicotine Pouches',
        url: 'https://www.webmd.com/smoking-cessation/nicotine-pouches',
      },
    ],
  },
  {
    title:
      'If you are ever struggling with nicotine addiction, these are some links to helpful organisations:',
    subSections: [
      {
        label: 'In Ireland:',
        links: [
          {
            label: 'HSE – Get Help to Quit',
            url: 'https://www2.hse.ie/living-well/quit-smoking/get-help-to-quit/',
          },
        ],
      },
      {
        label: 'Worldwide:',
        links: [
          {
            label: 'Smokefree.gov – Speak to an Expert',
            url: 'https://smokefree.gov/tools-tips/get-extra-help/speak-to-an-expert',
          },
        ],
      },
    ],
  },
  {
    title: 'Below are some helpline phone numbers:',
    subSections: [
      {
        label: 'In Ireland:',
        links: [{ label: 'HSE: 1800 459 459', url: null }],
      },
      {
        label: 'Worldwide:',
        links: [
          { label: 'NHS England: 0300 123 1044', url: null },
          { label: 'NHS Scotland: 0800 84 84 84', url: null },
          { label: 'NHS Wales: 0800 085 2219', url: null },
          {
            label: 'World Health Organization',
            url: 'https://www.who.int/campaigns/world-no-tobacco-day/2021/quitting-toolkit/toll-free-quitlines',
          },
        ],
      },
    ],
  },
];

const pollOptions = [
  { value: 'always' as const, label: 'Always' },
  { value: 'sometimes' as const, label: 'Sometimes' },
  { value: 'rarely' as const, label: 'Rarely' },
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

const ALL_AGE_GROUPS = ['Under 18', '18-25', '25-30', '31-40', '41-50', '51-60', '60+'];

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
