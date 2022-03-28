<script lang="ts" setup>
import { AlertVariant } from '../../@types/commons';

export interface AlertProps {
  variant: AlertVariant;
}
withDefaults(defineProps<AlertProps>(), {
  variant: 'info',
});
</script>

<template>
  <div
    class="p-2 border rounded w-full text-gray-100"
    :class="{
      'bg-blue-500 border-blue-300': variant === 'info',
      'bg-red-500 border-red-300': variant === 'error',
      'bg-green-500 border-green-300': variant === 'success',
      'bg-orange-500 border-orange-300': variant === 'warning',
    }"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped></style>
