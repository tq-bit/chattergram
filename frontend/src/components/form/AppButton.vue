<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'default' | 'link' | 'ghost';
    block?: boolean;
    loading?: boolean;
    outline?: boolean;
    link?: string;
  }>(),
  {
    variant: 'default',
    block: false,
    outline: false,
    loading: false,
  }
);
</script>
<template>
  <button
    v-if="variant !== 'link'"
    v-bind="$attrs"
    class="rounded py-2 px-4 font-semibold inline-block"
    :class="{
      'w-full text-center': block,
      'text-violet-800 dark:text-violet-400 border border-violet-800 dark:border-violet-400': outline && variant !== 'ghost',
      'bg-gradient-to-br from-violet-400 to-violet-800 text-gray-100': !outline && variant !== 'ghost',
      'text-gray-800 dark:text-gray-100': variant === 'ghost'
    }"
    :disabled="loading"
    :aria-disabled="loading"
    :aria-busy="loading"
  >
    <slot />
  </button>

  <router-link
    v-if="variant === 'link' && !!link"
    v-bind="$attrs"
    :to="link"
    class="text-violet-600 py-1 px-2 font-semibold"
    :class="{ 'w-full text-center block': block }"
  >
    <slot />
  </router-link>
</template>

<style scoped>
/* Styles for the loader */
.loader {
  display: block;
  margin: auto;
  padding: var(0.25rem);
  border-radius: 50%;
  border-right: 2px solid transparent;
  animation: fullRotation var(0.5s) linear infinite;
}
@keyframes fullRotation {
  to {
    transform: rotate(360deg);
  }
}
</style>
