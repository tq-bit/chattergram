<script setup lang="ts">
import AppContainer from '../components/layout/AppContainer.vue';
</script>

<template>
  <app-container page center>
    <div class="max-w-2xl">
      <h1 class="text-3xl mb-6">About Chattergram</h1>
      <p class="mb-4 text-lg">
        Chattergram is my submission to the Dev.to Hackerthon of
        <a
          class="font-semibold text-violet-800 dark:text-violet-400"
          href="https://dev.to/devteam/join-us-for-a-new-kind-of-hackathon-on-dev-brought-to-you-by-deepgram-2bjd"
        >
          Deepgram. </a
        ><br />
        Its purpose is to take recorded voicemails and transcribe them into readable text.
      </p>
      <hr class="mb-4 w-12 border border-purple-600" />
      <p class="mb-4">This app was inspired by two ideas.</p>

      <p class="mb-4">
        First and foremost: Make voicemails accessible. There are situations in which you simple
        cannot listen to recorded messages. Why not have the opportunity to read them?
      </p>

      <p class="mb-4">
        The second one: My impatience to listen to other peoples 5-minute pre-recorded nightmares
        (hence the slogan). A call might get the problem out of the way more quickly.
      </p>

      <p class="mb-4 mt-8 text-center border rounded py-2">
        Finally, thank you
        <a
          class="font-semibold text-violet-800 dark:text-violet-400"
          href="https://www.linkedin.com/in/tsvetomira-dichevska/"
          >@Tsvetomira Dichevska</a
        ><br/>
        for the logo and the inspirational talks.
      </p>
    </div>
  </app-container>
</template>

<style scoped></style>
