<template>
  <q-page
    class="flex flex-center"
    :class="$q.dark.isActive ? 'bg-gray-900' : 'bg-white'"
  >
    <q-spinner color="primary" size="50px" />
    <div
      class="q-mt-md"
      :class="$q.dark.isActive ? 'text-gray-300' : 'text-gray-600'"
    >
      Signing in...
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { supabase } from 'boot/supabase';

onMounted(async () => {
  try {
    const url = window.location.href;
    const readParam = (name: string): string | null => {
      const match = url.match(new RegExp(`[?#&]${name}=([^&#]+)`));
      const value = match?.[1];
      return value ? decodeURIComponent(value) : null;
    };

    const type = readParam('type');
    const tokenHash = readParam('token_hash');
    const accessToken = readParam('access_token');
    const refreshToken = readParam('refresh_token');

    if (tokenHash && type === 'recovery') {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'recovery',
      });

      if (verifyError) {
        console.error('Recovery verification failed:', verifyError);
        window.location.href = '/#/reset-password?error=invalid';
        return;
      }

      window.location.href = '/#/reset-password';
      return;
    }

    if (accessToken && refreshToken) {
      const { data, error: setSessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (setSessionError || !data.session) {
        console.error('Error setting session:', setSessionError);
        window.location.href = '/#/login';
        return;
      }

      if (type === 'recovery') {
        window.location.href = '/#/reset-password';
        return;
      }

      // Check if user has age group
      const { data: profile, error: profileError } = await supabase
        .from('account')
        .select('age_group')
        .eq('user_id', data.session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile check error:', profileError);
      }

      if (!profile || !profile.age_group) {
        window.location.href = '/#/complete-profile';
      } else {
        window.location.href = '/#/dashboard';
      }
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session && type === 'recovery') {
      window.location.href = '/#/reset-password';
      return;
    }

    window.location.href = '/#/login';
  } catch (error) {
    console.error('Auth callback error:', error);
    window.location.href = '/#/login';
  }
});
</script>
