<template>
  <q-page class="flex flex-center">
    <q-spinner color="primary" size="50px" />
    <div class="q-mt-md text-grey-7">Signing in...</div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { supabase } from 'boot/supabase';

onMounted(async () => {
  try {
    // Extract OAuth tokens from URL hash
    const fullHash = window.location.hash;

    if (!fullHash.includes('access_token')) {
      console.error('No access token found in URL hash');
      window.location.href = '/#/login';
      return;
    }

    console.log('OAuth callback detected, extracting tokens');

    // Read in the hash to extract tokens
    const tokensPart = fullHash.split('#').find(part => part.includes('access_token'));
    if (!tokensPart) {
      console.error('Could not parse tokens from hash');
      window.location.href = '/#/login';
      return;
    }

    const params = new URLSearchParams(tokensPart);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (!accessToken || !refreshToken) {
      console.error('Missing access or refresh token');
      window.location.href = '/#/login';
      return;
    }

    console.log('Setting session with tokens');

    // Set the session in Supabase
    const { data, error: setSessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (setSessionError) {
      console.error('Error setting session:', setSessionError);
      window.location.href = '/#/login';
      return;
    }

    if (!data.session) {
      console.error('No session after setSession');
      window.location.href = '/#/login';
      return;
    }

    console.log('Session established for user:', data.session.user.id);

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
      console.log('Redirecting to complete-profile');
      window.location.href = '/#/complete-profile';
    } else {
      console.log('Redirecting to dashboard');
      window.location.href = '/#/dashboard';
    }
  } catch (error) {
    console.error('Auth callback error:', error);
    window.location.href = '/#/login';
  }
});
</script>
