<script lang="ts" setup>
import { computed } from 'vue';
import { AppNavigationItem, navigation } from '../../router';
import { useRouter } from 'vue-router';
import iClose from '../icons/iClose.vue';
import useSession from '../../store/session';

const { token } = useSession();
const router = useRouter();

const emit = defineEmits(['toggleSidebar']);
withDefaults(defineProps<{ show: boolean }>(), {
  show: false,
});

const activeNavigation = computed(() => {
  const hasActiveSession = token.value !== '';
  if (hasActiveSession) {
    return navigation.filter((nav) => nav.requiresLogin === true);
  }
  return navigation.filter((nav) => nav.requiresLogin === false);
});

const onClick = (route: AppNavigationItem): void => {
  if (route.path) {
    router.push({ path: route.path });
  }
  if (route.fn) {
    router.push({ path: '/' });
    route.fn();
  }
  emit('toggleSidebar');
};
</script>

<template>
  <Transition name="sidebar">
    <aside
      v-if="show"
      class="fixed border-r-2 border-gray-500 top-0 left-0 w-screen max-w-xs h-screen z-50 px-4 pt-4 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-50"
    >
      <header class="text-right">
        <button @click="$emit('toggleSidebar')">
          <i-close></i-close>
        </button>
      </header>
      <main class="flex flex-col">
        <button
          v-for="route in activeNavigation"
          :key="route?.name"
          @click="onClick(route)"
          class="my-3 text-lg text-center w-full font-semibold"
        >
          {{ route?.name }}
        </button>
      </main>
    </aside>
  </Transition>
</template>

<style scoped>
.sidebar-enter-from,
.sidebar-leave-active {
  transform: translateX(-20rem);
}

.sidebar-enter-active,
.sidebar-leave-active {
  transition: all 0.5s;
}
</style>
