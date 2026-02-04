<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px; max-width: 90vw">
      <q-card-section class="text-center">
        <div class="text-h6">Sign Up</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleSignup" class="q-gutter-md">
          <q-input
            filled
            v-model="email"
            label="Email"
            type="email"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Email required']"
          />

          <q-input
            filled
            v-model="password"
            label="Password"
            type="password"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Password required']"
          />

          <q-select
            filled
            v-model="ageGroup"
            label="Age Group"
            :options="ageGroupOptions"
            lazy-rules
            :rules="[(val) => !!val || 'Age group required']"
          />

          <div>
            <q-btn
              label="Sign Up"
              type="submit"
              color="primary"
              class="full-width"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { supabase } from 'boot/supabase';

const $q = useQuasar();
const router = useRouter();

const email = ref('');
const password = ref('');
const ageGroup = ref<string | null>(null);
const loading = ref(false);

const ageGroupOptions = ['Under 18', '18-25', '25-30', '31-40', '41-50', '60+'];

// Handle user sign up, authenticate the account when user created
const handleSignup = async () => {
  loading.value = true;
  try {
    // Create authenticated user
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;

    // Create profile in account table
    if (data.user) {
      const { error: profileError } = await supabase.from('account').insert([
        {
          user_id: data.user.id,
          age_group: ageGroup.value,
        },
      ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    $q.notify({
      type: 'positive',
      message: 'Sign up successful!',
    });

    await router.push('/dashboard');
  } catch (error) {
    // If there was a sign up error
    console.error('Signup error:', error);
    const err = error as Error;
    $q.notify({
      type: 'negative',
      message: err.message || 'Error signing up',
    });
  } finally {
    loading.value = false;
  }
};
</script>
