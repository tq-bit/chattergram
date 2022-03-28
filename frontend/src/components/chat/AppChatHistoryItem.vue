<script setup lang="ts">
import { computed, inject, Ref } from 'vue';
import AppAudioPlayer from '../ui/AppAudioPlayer.vue';
import { ChatHistoryItem } from '../../store/chat';
import { PublicUser } from '../../store/users';
import { ActiveUser } from '../../store/session';

import { convertBase64ToObjectUrl } from '../../utils/convert';

const chatPartner = inject('chatPartner') as Ref<PublicUser>;
const user = inject('user') as Ref<ActiveUser>;

const props = defineProps<{ historyItem: ChatHistoryItem }>();

const wasSentByActiveUser = computed(() => {
  return +user.value.id === +props.historyItem.senderId;
});

const activeUser = computed(() => {
  if (wasSentByActiveUser.value) {
    return `${user.value.username} (You)`;
  } else {
    return chatPartner.value?.username;
  }
});

const dateSent = computed(() => {
  const now = new Date();
  const dateSentRaw = new Date(props.historyItem.dateSent);
  const daysPassedSinceSent = (now.getTime() - dateSentRaw.getTime()) / 1000 / 60 / 60 / 24;

  // less than 1 day ago means < 24h
  if (daysPassedSinceSent < 1) {
    return `Less than 24h ago`;
  }

  return `${Math.ceil(daysPassedSinceSent)} days ago`;
});
const audioFileUrl = computed(() => {
  if (props.historyItem.audioFile) {
    return convertBase64ToObjectUrl(props.historyItem.audioFile);
  }
  return null;
});
</script>

<template>
  <li
    class="px-8 py-4 mx-2 mb-4 w-fit max-w-xs md:max-w-xl rounded-2xl break-words"
    :class="{
      'bg-gradient-to-br from-violet-600 to-violet-800  text-gray-100 ml-auto': wasSentByActiveUser,
      'bg-gradient-to-bl from-violet-400 to-violet-500 text-gray-100 mr-auto': !wasSentByActiveUser,
    }"
  >
    <h3 class="inline font-semibold text-lg">
      {{ activeUser }}
    </h3>
    - <span>{{ dateSent }}</span>
    <app-audio-player v-if="audioFileUrl" :audio-file-url="audioFileUrl"></app-audio-player>
    <p class="mb-2">{{ historyItem.text }}</p>
    <small class="bg-gray-200 text-violet-800 p-1 px-2 rounded-lg" v-if="historyItem.confidence"
      ><span class="font-bold">{{ (historyItem.confidence*100).toFixed(2) }}%</span> transcript accuracy </small
    >
  </li>
</template>

<style scoped></style>
