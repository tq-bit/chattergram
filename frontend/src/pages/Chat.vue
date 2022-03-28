<script setup lang="ts">
import { ref, computed, onMounted, provide, onUnmounted } from 'vue';
import AppChatGrid from '../components/layout/AppChatGrid.vue';
import AppChatUserList from '../components/chat/AppChatUserList.vue';
import AppChatHistoryList from '../components/chat/AppChatHistoryList.vue';
import AppChatInput from '../components/chat/AppChatInput.vue';
import AppChatRecordingBlend from '../components/blends/AppChatRecordingBlend.vue';
import AppChatLoadingBlend from '../components/blends/AppChatLoadingBlend.vue';
import AppChatGridToggle from '../components/layout/AppChatGridToggle.vue';
import AppButton from '../components/form/AppButton.vue';

import useUsers, { PublicUser } from '../store/users';
import useChat from '../store/chat';
import useSession from '../store/session';
import useRecorder from '../use/recorder';
import Logo from '../assets/logo.gif';

const { users, fetchUsers, chatPartner, setChatpartner } = useUsers();
const {
  loading,
  createChatItem,
  chatHistory,
  fetchChatHistory,
  createChatItemWithRecordedFile,
  socketStatus,
  connect,
  close,
} = useChat();
const {
  isRecording,
  startRecording,
  stopRecording,
  recordedFile,
  requestAudioPermission,
  hasAudioPermission,
} = useRecorder();
const { user } = useSession();

provide('chatPartner', chatPartner);
provide('users', users);
provide('user', user);

const showChatPartnerSidebar = ref(false);

const hasChatPartner = computed(() => !!chatPartner.value && chatPartner.value.id !== 0);

const onToggleChatSidebar = () => {
  showChatPartnerSidebar.value = !showChatPartnerSidebar.value;
};

const onUserSelected = async (payload: PublicUser) => {
  onToggleChatSidebar();
  setChatpartner(payload);
  await fetchChatHistory();
};

const onClickRecord = async () => {
  if (isRecording.value === false) {
    return startRecording();
  }
  stopRecording();

  // FIXME: Remove this timeout and replace with promise or suchlike
  setTimeout(() => createChatItemWithRecordedFile(recordedFile.value));
};

const onClickReconnect = () => {
  close();
  connect();
};

const onClickCancelRecord = () => {
  stopRecording();
};

onMounted(async () => {
  if (socketStatus.value === 'open') {
    close();
  }
  if (socketStatus.value === 'closed') {
    connect();
  }
  requestAudioPermission();
  await fetchUsers();
});

onUnmounted(() => close());
</script>

<template>
  <app-chat-grid
    :show-sidebar="showChatPartnerSidebar"
    @toggle-sidebar="onToggleChatSidebar"
    class="h-screen"
  >
    <template v-slot:aside>
      <app-chat-user-list
        @user-selected="onUserSelected"
        :chat-partner="chatPartner"
        :users="users"
      ></app-chat-user-list>
    </template>

    <template v-slot:default>
      <app-chat-recording-blend
        :show="isRecording"
        @finish-record="onClickRecord"
        @cancel-record="onClickCancelRecord"
      ></app-chat-recording-blend>

      <app-chat-loading-blend :show="loading"></app-chat-loading-blend>

      <app-chat-grid-toggle @click="onToggleChatSidebar"></app-chat-grid-toggle>

      <app-chat-history-list
        v-if="hasChatPartner"
        :history-items="chatHistory"
      ></app-chat-history-list>

      <app-chat-input
        v-if="hasChatPartner"
        @click-record="onClickRecord"
        @submit="createChatItem"
        class="absolute bottom-0 right-0"
      ></app-chat-input>

      <!-- Alternative text to be shown when no chat partner is selected -->
      <div class="flex flex-col h-full items-center justify-center" v-if="!hasChatPartner">
        <img class="mx-auto block" :src="Logo" height="600" width="300" alt="Chattergram Logo" />
        <p>Select a user to get started</p>
      </div>

      <!-- First aid toolbar for WS connection or audio permissions -->
      <section class="absolute bottom-12 left-0 w-full">
        <p v-if="socketStatus === 'closed'" class="p-1">
          You are not connected to the live chat.
          <app-button title="Try to reconnect" @click="onClickReconnect"> Click here </app-button>
          to try and reconnect
        </p>

        <p v-if="!hasAudioPermission" class="p-1">
          You did not grant audio permission.
          <app-button
            outline
            title="Try to request audio permission"
            @click="requestAudioPermission"
          >
            Click here
          </app-button>
          to request it again
        </p>
      </section>
    </template>
  </app-chat-grid>
</template>
