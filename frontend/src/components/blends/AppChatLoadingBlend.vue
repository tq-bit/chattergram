<script setup lang="ts">
import iaRipple from '../icons/iaRipple.vue';

withDefaults(defineProps<{ show: boolean }>(), { show: false });
</script>

<template>
  <Transition name="fade">
    <div
      class="absolute top-0 left-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 h-full w-full z-10"
      v-if="show"
    >
      <ia-ripple></ia-ripple>
    </div>
  </Transition>
</template>
