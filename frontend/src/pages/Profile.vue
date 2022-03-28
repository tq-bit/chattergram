<script setup lang="ts">
import AppContainer from '../components/layout/AppContainer.vue';
import TrophyMeme from '../assets/trophymeme.jpg';
</script>

<template>
  <app-container tag="main" page center>
    <div>
      <img class="rounded" :src="TrophyMeme" height="800" width="375" alt="" />
      <p class="text-center my-4">Sorry folks, some day perhaps ...</p>
      <router-link class="text-center block font-bold text-violet-500 w-full" to="/chat"
        >Back to chat</router-link
      >
    </div>
  </app-container>
</template>
