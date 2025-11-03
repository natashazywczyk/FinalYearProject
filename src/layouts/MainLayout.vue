<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-icon name="no_smoking" size="sm" />
          CraveControl
        </q-toolbar-title>

        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header>
          Navigation
        </q-item-label>

        <q-item clickable v-ripple @click="$router.push('/')">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="$router.push('/products')">
          <q-item-section avatar>
            <q-icon name="shopping_cart" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Vaping Products</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable v-ripple @click="handleLogout">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Logout</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../boot/supabase'
import { Notify } from 'quasar'

export default {
  name: 'MainLayout',
  setup() {
    const router = useRouter()
    const leftDrawerOpen = ref(false)

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    const handleLogout = async () => {
      try {
        await supabase.auth.signOut()
        Notify.create({
          type: 'positive',
          message: 'Logged out successfully'
        })
        router.push('/login')
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: 'Error logging out: ' + error.message
        })
      }
    }

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      handleLogout
    }
  }
}
</script>
