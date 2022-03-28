<script setup lang="ts">
import { inject, Ref } from 'vue';
import AppChatUserItem from './AppChatUserItem.vue';
import AppInput from '../form/AppInput.vue';

import { PublicUser } from '../../store/users';

const chatPartner = inject('chatPartner') as Ref<PublicUser>;
const users = inject('users') as Ref<PublicUser[]>;

const emit = defineEmits(['userSelected']);
</script>

<template>
  <div class="relative h-full">
    <ul
      class="absolute top-0 md:top-16 left-0 bottom-0 max-h-full w-full bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-50 overflow-auto overflow-y"
    >

    <app-input class="px-4" label="Search for users ..."> </app-input>
      <app-chat-user-item
        class="hover:bg-violet-600 hover:text-gray-100 transition-all cursor-pointer"
        :class="{
          'bg-violet-600 text-gray-100': user.id === chatPartner?.id,
        }"
        v-for="user in users"
        :key="user.username"
        :user="user"
        @click="emit('userSelected', user)"
      ></app-chat-user-item>
    </ul>
  </div>
</template>
