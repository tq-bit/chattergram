<script setup lang="ts">
defineProps<{ center?: boolean; title?: string }>();
</script>

<template>
  <div class="p-4 w-96 h-auto md:mb-40" :class="{ 'text-center': center }">
    <div class="flex w-full items-center justify-center">
      <div class="bg-gradient-to-br from-violet-400 text-gray-100 to-violet-800 p-4 rounded-full">
        <slot name="icon" />
      </div>
    </div>
    <h3 class="text-3xl text-center mt-4 mb-8">{{ title }}</h3>
    <slot name="default" />
  </div>
</template>
