<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <div style="font-size: 100px">404</div>
      <div class="text-h5 q-mb-md">Oops. Nothing here...</div>
      <q-btn
        label="Go Home"
        color="primary"
        @click="$router.push('/')"
        icon="home"
      />
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'ErrorNotFound'
}
</script>
