<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppHeader from './components/ui/AppHeader.vue';
import AppSidebar from './components/ui/AppSidebar.vue';
import AppAlert from './components/ui/AppAlert.vue';

import useAppAlert from './use/app-alert';
import useSession from './store/session';

const { message, showAppAlert, variant } = useAppAlert();
const { syncLocalApiToken, username } = useSession();
let showSidebar = ref(false);

const title = username.value ? `Logged in as ${username.value}` : 'Chattergram';

onMounted(() => syncLocalApiToken());
</script>

<template>
  <div>
    <Transition name="fade-from-top">
      <app-alert
        v-if="showAppAlert && message"
        :variant="variant"
        class="absolute z-50 top-20 right-4 left-4 w-64 max-w-xs text-center block mx-auto"
      >
        {{ message }}
      </app-alert>
    </Transition>

    <app-header :title="title" @toggle-sidebar="showSidebar = !showSidebar"></app-header>
    <app-sidebar :show="showSidebar" @toggle-sidebar="showSidebar = !showSidebar"></app-sidebar>
    <main>
      <router-view v-slot="{ Component }">
        <transition mode="out-in" name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>
