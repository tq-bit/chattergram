<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import AppContainer from '../components/layout/AppContainer.vue';
import AppFormCard from '../components/ui/AppFormCard.vue';
import AppAlert from '../components/ui/AppAlert.vue';
import AppInput from '../components/form/AppInput.vue';
import AppButton from '../components/form/AppButton.vue';
import iLogin from '../components/icons/iLogin.vue';

import { AlertVariant } from '../@types/commons'

import useUserForm from '../use/userForm';

const { handleUserSubmit, email, validationErrors, httpError, hasFormErrors, password, loading } =
  useUserForm('login');
const router = useRouter();

const loginForm = ref<HTMLFormElement | null>(null);
const alertVariant = ref<AlertVariant>(!!validationErrors ? 'error' : 'success');

const onSubmit = async (): Promise<void> => {
  await handleUserSubmit();

  if (!hasFormErrors.value && !httpError.value) {
    loginForm.value?.reset();
    router.push({ path: '/chat' });
  }
};
</script>

<template>
  <app-container tag="main" page center>
    <app-form-card title="Login to chat">
      <template v-slot:icon>
        <i-login></i-login>
      </template>
      <template v-slot:default>
        <form ref="loginForm" @submit.prevent="onSubmit">
          <app-alert class="mb-6" v-if="hasFormErrors" :variant="alertVariant">
            <ul>
              <li>{{ httpError?.message }}</li>
              <li>{{ validationErrors?.email }}</li>
              <li>{{ validationErrors?.password }}</li>
            </ul>
          </app-alert>
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
            label-prefix="Enter your "
          ></app-input>
          <app-button :loading="loading" class="mb-2" type="submit" block>Login</app-button>

          <app-button variant="link" link="/signup" block>No account yet? Sign up</app-button>
        </form>
      </template>
    </app-form-card>
  </app-container>
</template>
