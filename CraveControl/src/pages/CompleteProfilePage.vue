<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px; max-width: 90vw">
      <q-card-section class="text-center">
        <div class="text-h6">Complete Your Profile</div>
        <div class="text-caption text-grey-7 q-mt-sm">
          Select your age group to continue
        </div>
      </q-card-section>

      <q-card-section v-if="checkingSession" class="text-center">
        <q-spinner color="primary" size="50px" />
        <div class="q-mt-md text-grey-7">Loading...</div>
      </q-card-section>

      <q-card-section v-else>
        <q-select
          filled
          v-model="selectedAgeGroup"
          label="Age Group"
          :options="ageGroupOptions"
          lazy-rules
          :rules="[(val) => !!val || 'Age group required']"
        />

        <q-btn
          label="Continue to Dashboard"
          color="primary"
          class="full-width q-mt-md"
          @click="saveAgeGroup"
          :loading="loading"
          :disable="!selectedAgeGroup"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { supabase } from 'boot/supabase';

const $q = useQuasar();
const router = useRouter();

const selectedAgeGroup = ref<string | null>(null);
const loading = ref(false);
const checkingSession = ref(true);

const ageGroupOptions = ['Under 18', '18-25', '25-30', '31-40', '41-50', '60+'];

// Check for existing session on mount
onMounted(async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      $q.notify({
        type: 'negative',
        message: 'No active session. Please log in again.',
      });
      router.push('/login');
      return;
    }

    // Check if user already has profile with age group
    const { data: profile } = await supabase
      .from('account')
      .select('age_group')
      .eq('user_id', session.user.id)
      .maybeSingle();

    // If age group is assigned, go to dashboard
    if (profile?.age_group) {
      router.push('/dashboard');
    }
  } catch (error) {
    console.error('Error checking session:', error);
  } finally {
    checkingSession.value = false;
  }
});

const saveAgeGroup = async () => {
  if (!selectedAgeGroup.value) {
    $q.notify({
      type: 'negative',
      message: 'Please select your age group',
    });
    return;
  }

  loading.value = true;

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      $q.notify({
        type: 'negative',
        message: 'Session expired. Please log in again.',
      });
      router.push('/login');
      return;
    }

    // Create account with age group
    const { error } = await supabase.from('account').insert([
      {
        user_id: session.user.id,
        age_group: selectedAgeGroup.value,
      },
    ]);

    if (error) {
      // If error is duplicate key, update instead
      // 23505 is Postgres code for duplicate keys
      if (error.code === '23505') {
        const { error: updateError } = await supabase
          .from('account')
          .update({ age_group: selectedAgeGroup.value })
          .eq('user_id', session.user.id);

        if (updateError) throw updateError;
      } else {
        throw error;
      }
    }

    $q.notify({
      type: 'positive',
      message: 'Profile completed successfully!',
    });

    // Force reload to trigger router guard and go to dashboard
    window.location.href = '/#/dashboard';
  } catch (error) {
    console.error('Error saving age group:', error);
    $q.notify({
      type: 'negative',
      message: 'Error saving age group',
    });
  } finally {
    loading.value = false;
  }
};

</script>
