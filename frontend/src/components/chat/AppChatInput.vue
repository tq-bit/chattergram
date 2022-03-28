<script setup lang="ts">
import { ref } from 'vue';
import AppInput from '../form/AppInput.vue';
import AppButton from '../form/AppButton.vue';
import iMicrophone from '../icons/iMicrophone.vue';
import iChat from '../icons/iChat.vue';

const chatText = ref<string>('');

const emit = defineEmits<{
  (event: 'submit', chatText: string): void;
  (event: 'clickRecord'): void;
}>();

const onSubmit = () => {
  if (chatText.value) {
    emit('submit', chatText.value);
    chatText.value = '';
  }
};
</script>

<template>
  <form
    @submit.prevent="onSubmit"
    class="w-full h-12 flex bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-50"
  >
    <app-input class="w-full" v-model="chatText"></app-input>
    <app-button title="Send message" type="submit" class="absolute bottom-1 right-0" variant="ghost"
      ><i-chat></i-chat
    ></app-button>
    <app-button
      type="button"
      title="Record a voice message"
      class="absolute bottom-1 right-12"
      variant="ghost"
      @click="emit('clickRecord')"
    >
      <i-microphone></i-microphone
    ></app-button>
  </form>
</template>

<style scoped></style>
