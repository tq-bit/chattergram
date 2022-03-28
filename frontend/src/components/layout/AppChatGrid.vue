<script setup lang="ts">
import iClose from '../icons/iClose.vue';

defineProps<{ showSidebar: boolean }>();

const emit = defineEmits(['toggleSidebar']);
</script>

<template>
  <div class="relative grid grid-cols-12 min-h-screen">
    <transition name="grid-sidebar">
      <aside
        v-if="showSidebar"
        class="block md:hidden absolute z-10 top-16  bottom-0 w-full overflow-y-hidden"
      >
        <header class="text-right p-4 pb-2 bg-gray-50 dark:bg-gray-800">
          <button @click="emit('toggleSidebar')">
            <i-close></i-close>
          </button>
        </header>
        <slot name="aside">Aside slot</slot>
      </aside>
    </transition>

    <div class="col-span-12 md:col-span-3 lg:col-span-2 hidden md:block">
      <slot name="aside">Aside slot</slot>
    </div>

    <div class="col-span-12 md:col-span-9 lg:col-span-10 relative">
      <slot name="default">Main</slot>
    </div>
  </div>
</template>

<style scoped></style>
