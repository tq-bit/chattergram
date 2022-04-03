<script setup lang="ts">
import { ref, watch, computed, nextTick, inject, ComputedRef, Ref } from 'vue';
import AppChatHistoryItem from './AppChatHistoryItem.vue';
import AppContainer from '../layout/AppContainer.vue';
import iMicrophone from '../icons/iMicrophone.vue';
import { PublicUser } from '../../store/users';
import { ChatHistoryItem } from '../../store/chat';

const chatPartner = inject('chatPartner') as Ref<PublicUser>;

const props = defineProps<{ historyItems: ChatHistoryItem[] }>();

const chatHistoryListElement = ref<HTMLElement | null>(null);
const scrollHistoryListToBottom = () =>
  chatHistoryListElement.value?.scrollTo(0, chatHistoryListElement.value.scrollHeight);

const historyItemCount: ComputedRef<number> = computed(() => props.historyItems.length);
watch(historyItemCount, () => {
  nextTick(() => scrollHistoryListToBottom());
});
</script>

<template>
  <div class="relative h-full">
    <div class="absolute top-16 left-0 bottom-12 max-h-full w-full">
      <transition name="fade" mode="out-in">
        <ul
          v-if="historyItemCount > 0"
          ref="chatHistoryListElement"
          class="max-h-full w-full overflow-x-hidden overflow-y"
        >
          <transition-group name="fade-from-right">
            <app-chat-history-item
              v-for="historyItem in historyItems"
              :key="historyItem.dateSent"
              :history-item="historyItem"
            ></app-chat-history-item>
          </transition-group>
        </ul>
      </transition>

      <transition name="fade" mode="out-in">
        <app-container v-if="historyItemCount === 0" tag="div" page center>
          <h2 class="text-violet-800 dark:text-violet-400 text-2xl mb-4">
            Start your chat with {{ chatPartner.username }}
          </h2>
          <p>
            Click on the <i-microphone class="inline"></i-microphone> symbol to <br />
            start recording a message
          </p>
        </app-container>
      </transition>
    </div>
  </div>
</template>

<style scoped></style>
