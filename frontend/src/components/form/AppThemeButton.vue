<script setup lang="ts">
import { ref, onMounted } from 'vue';

type UserTheme = 'light' | 'dark';

const setTheme = (theme: UserTheme) => {
  localStorage.setItem('user-theme', theme);
  userTheme.value = theme;
  document.documentElement.className = theme;
};

const getTheme = (): UserTheme => {
  return localStorage.getItem('user-theme') as UserTheme;
};

const toggleTheme = (): void => {
  const activeTheme = localStorage.getItem('user-theme');
  if (activeTheme === 'light') {
    setTheme('dark');
  } else {
    setTheme('light');
  }
};

const getMediaPreference = (): UserTheme => {
  const hasDarkPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (hasDarkPreference) {
    return 'dark';
  } else {
    return 'light';
  }
};

const userTheme = ref<UserTheme>(getTheme() || getMediaPreference());

onMounted(() => setTheme(userTheme.value));
</script>

<template>
  <button @click="toggleTheme">
    <span v-if="userTheme === 'dark'">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="icon fill-current"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </span>
    <span v-if="userTheme === 'light'">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="icon"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    </span>
  </button>
</template>
