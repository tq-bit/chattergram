<script setup lang="ts">
import { PublicUser } from '../../store/users';

defineProps<{ user: PublicUser }>();
</script>

<template>
  <li class="grid grid-cols-6 w-full py-2">
    <div class="col-span-1 flex justify-center items-center p-1">
      <div
        class="rounded-full border border-green-500 p-1"
        :class="{
          'bg-green-500': user.online,
        }"
      ></div>
    </div>
    <div class="col-span-4 flex justify-center items-center p-1">
      <p class="text-opacity-10">{{ user.username }}</p>
    </div>
  </li>
</template>
