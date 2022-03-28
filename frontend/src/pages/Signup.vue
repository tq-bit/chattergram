<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { AlertVariant } from '../@types/commons';

import AppContainer from '../components/layout/AppContainer.vue';
import AppFormCard from '../components/ui/AppFormCard.vue';
import AppAlert from '../components/ui/AppAlert.vue';
import AppInput from '../components/form/AppInput.vue';
import AppButton from '../components/form/AppButton.vue';
import iUser from '../components/icons/iUser.vue';

import useUserForm from '../use/userForm';

const {
  handleUserSubmit,
  email,
  username,
  validationErrors,
  httpError,
  hasFormErrors,
  password,
  loading,
} = useUserForm('signup');
const router = useRouter();

const signupForm = ref<HTMLFormElement | null>(null);
const alertVariant = ref<AlertVariant>(!!validationErrors ? 'error' : 'success');

const onSubmit = async (): Promise<void> => {
  await handleUserSubmit();
  if (!hasFormErrors.value && !httpError.value) {
    signupForm.value?.reset();
    router.push({ path: '/chat' });
  }
};
</script>

<template>
  <app-container tag="main" page center>
    <app-form-card title="Create your account">
      <template v-slot:icon>
        <i-user></i-user>
      </template>
      <template v-slot:default>
        <form ref="signupForm" @submit.prevent="onSubmit">
          <app-alert class="mb-6" v-if="hasFormErrors" :variant="alertVariant">
            <ul>
              <li>{{ httpError?.message }}</li>
              <li>{{ validationErrors?.email }}</li>
              <li>{{ validationErrors?.password }}</li>
            </ul>
          </app-alert>
          <app-input
            class="mb-2"
            name="username"
            v-model="username"
            label="Username"
            label-prefix="Pick a "
          ></app-input>
          <app-input
            class="mb-2"
            name="email"
            v-model="email"
            label="Email address"
            label-prefix="Enter your "
          ></app-input>
          <app-input
            class="mb-2"
            name="password"
            v-model="password"
            type="password"
            label="Password"
            label-prefix="Choose a strong "
          ></app-input>
          <app-button :loading="loading" class="mb-2" type="submit" block>Sign up</app-button>
          <app-button type="button" variant="link" link="/login" block
            >Already have an account? Login</app-button
          >
        </form>
      </template>
    </app-form-card>
  </app-container>
</template>
