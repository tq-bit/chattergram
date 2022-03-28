<script setup lang="ts">
import iMenu from '../icons/iMenu.vue';
import AppThemeButton from '../form/AppThemeButton.vue';

withDefaults(defineProps<{ title: string }>(), { title: 'Chattergram' });
defineEmits(['toggleSidebar']);
</script>

<template>
  <header
    class="absolute z-50 top-0 left-0 w-full h-16 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-50"
  >
    <div class="grid grid-cols-3 h-16">
      <div class="col-span-1 flex items-center justify-start ml-4">
        <button class="flex flex-row" @click="$emit('toggleSidebar')">
          <i-menu></i-menu> <span class="ml-2 hidden md:block">Menu</span>
        </button>
      </div>
      <div class="col-span-1 flex items-center justify-center text-lg font-semibold">
        <h2 class="text-xl">{{ title }}</h2>
      </div>
      <div class="col-span-1 flex items-center justify-end mr-4">
        <app-theme-button></app-theme-button>
      </div>
    </div>
  </header>
</template>
