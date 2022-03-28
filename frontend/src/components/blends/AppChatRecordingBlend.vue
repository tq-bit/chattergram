<script setup lang="ts">
import AppButton from '../form/AppButton.vue';
import iMicrophoneLg from '../icons/iMicrophoneLg.vue';

withDefaults(defineProps<{ show: boolean }>(), { show: false });

const emit = defineEmits(['finishRecord', 'cancelRecord']);
</script>

<template>
  <Transition name="fade">
    <div
      class="absolute top-0 left-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 h-full w-full z-20"
      v-if="show"
    >
      <div
        class="flex items-center justify-center w-44 h-44 rounded-full border-4 border-red-800 animate-pulse mb-8"
      >
        <i-microphone-lg class="text-red-800"></i-microphone-lg>
      </div>
      <div class="w-40">
        <app-button block class="mb-4" @click="emit('finishRecord')">
          <span class="text-2xl">Send</span>
        </app-button>
        <app-button block outline class="text-lg" @click="emit('cancelRecord')">Cancel</app-button>
      </div>
    </div>
  </Transition>
</template>

<style scoped></style>
