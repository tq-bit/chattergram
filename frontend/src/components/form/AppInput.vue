<script setup lang="ts">
withDefaults(
  defineProps<{
    labelPrefix?: string;
    label?: string;
    placeholder?: string
    modelValue?: string | number;
    error?: string;
    required?: boolean;
    requiredSign?: string;
    variant?: 'default' | 'chat';
  }>(),
  {
    required: false,
    requiredSign: '*',
    variant: 'default',
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', chatText: string): void;
}>();

const onInput = (ev: Event) => emit('update:modelValue', (ev.target as HTMLInputElement).value);
</script>

<template>
  <div>
    <label v-if="label" class="font-semibold block mb-2">
      {{ label }}
      <span class="text-red-500" v-if="required">{{ requiredSign }}</span>
    </label>
    <!-- @ts-ignore -->
    <input
      class="h-full bg-transparent outline-none p-2"
      :class="{
        'text-gray-900 dark:text-gray-100 w-full border-b transition-all border-gray-600 focus:border-violet-600 focus:dark:border-violet-400 dark:border-gray-400 ':
          variant === 'default',
      }"
      v-bind="$attrs"
      @input="onInput"
      :value="modelValue"
      :required="required"
      :placeholder="labelPrefix ? labelPrefix + label?.toLowerCase() : label || $attrs.placeholder as string"
    />
  </div>
</template>
