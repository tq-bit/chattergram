<script setup lang="ts">
import { onMounted, ref } from 'vue';
import iPlay from '../icons/iPlay.vue';
import iPause from '../icons/iPause.vue';

const audioPlayer = ref<HTMLAudioElement | null>(null);
const playbackTime = ref<number>(0);
const audioDuration = ref<number>(Infinity);
const isPlaying = ref<boolean>(false);

defineProps<{ audioFileUrl: string | null }>();

const onClick = () => {
  if (audioPlayer.value) {
    if (isPlaying.value) {
      audioPlayer.value.pause();
    } else {
      audioPlayer.value.play();
    }
    isPlaying.value = !isPlaying.value;
  }
};

const onChange = (ev: Event) => {
  if (audioPlayer.value) {
    audioPlayer.value.currentTime = +(ev.target as HTMLInputElement).value;
    playbackTime.value = +(ev.target as HTMLInputElement).value;
  }
};

const syncAudioPlayer = () => {
  if (audioPlayer.value) {
    audioPlayer.value.ontimeupdate = () => {
      audioDuration.value = audioPlayer.value?.duration || Infinity;
      playbackTime.value = audioPlayer.value?.currentTime || 0;
    };

    audioPlayer.value.onended = () => {
      isPlaying.value = false;
    };
  }
};

onMounted(() => syncAudioPlayer());
</script>

<template>
  <div class="flex flex-row justify-start items-center my-2">
    <audio class="hidden" ref="audioPlayer" v-if="audioFileUrl" controls>
      <source :src="audioFileUrl" type="audio/mpeg" />
    </audio>

    <button class="mr-2" @click="onClick" v-if="!isPlaying"><i-play></i-play></button>
    <button class="mr-2" @click="onClick" v-if="isPlaying"> <i-pause></i-pause> </button>
    <input
      type="range"
      step="0.01"
      :value="playbackTime"
      :max="audioDuration"
      min="0"
      @change="onChange"
    />
  </div>
</template>

<style scoped>
input[type='range'] {
  @apply bg-gray-200 cursor-pointer w-40 h-4;
  -webkit-appearance: none;
}
input[type='range']:focus {
  @apply outline-none;
}
input[type='range']::-webkit-slider-runnable-track {
  @apply bg-gray-200 cursor-pointer w-40 h-4;
}
input[type='range']::-webkit-slider-thumb {
  @apply h-4 w-4 bg-violet-300 cursor-pointer;
  -webkit-appearance: none;
}
input[type='range']:focus::-webkit-slider-runnable-track {
  background: #dddddd;
}
input[type='range']::-moz-range-track {
  @apply bg-gray-200 cursor-pointer w-40 h-4;
}
input[type='range']::-moz-range-thumb {
  @apply h-4 w-4 bg-violet-300 cursor-pointer;
}
input[type='range']::-ms-track {
  @apply bg-gray-200 cursor-pointer w-40 h-4;
}
input[type='range']::-ms-fill-lower {
  @apply bg-gray-200;
}
input[type='range']::-ms-fill-upper {
  @apply bg-gray-200;
}
input[type='range']::-ms-thumb {
  @apply h-4 w-4 bg-violet-300 cursor-pointer;
}
input[type='range']:focus::-ms-fill-lower {
  background: transparent;
}
input[type='range']:focus::-ms-fill-upper {
  background: transparent;
}
</style>
