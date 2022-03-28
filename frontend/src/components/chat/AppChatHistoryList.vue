<script setup lang="ts">
import { ref, watch, computed, nextTick, ComputedRef } from 'vue';
import AppChatHistoryItem from './AppChatHistoryItem.vue';
import { ChatHistoryItem } from '../../store/chat';

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
    <ul
      ref="chatHistoryListElement"
      class="absolute top-16 left-0 bottom-12 max-h-full w-full overflow-x-hidden overflow-y"
    >
      <transition-group name="fade-from-right">
        <app-chat-history-item
          v-for="historyItem in historyItems"
          :key="historyItem.dateSent"
          :history-item="historyItem"
        ></app-chat-history-item>
      </transition-group>
    </ul>
  </div>
</template>

<style scoped></style>
