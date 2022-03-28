import { ref, computed } from 'vue';
import * as yup from 'yup';
import { useForm, useField, FieldContext } from 'vee-validate';
import useSession, { UserLoginPayload } from '../store/session';
import { AppServerErrorResponse } from '../@types/commons';
import useAppAlert from './app-alert';

export type UserForm = 'login' | 'signup';

const formValidationSchema = yup.object({
  email: yup.string().required().email().label('Email address'),
  username: yup.string().label('Username'),
  password: yup.string().required().min(8).label('Password'),
});

export default function handleUserForm(type: UserForm) {
  const { login, signup } = useSession();
  const { handleSubmit } = useForm({
    validationSchema: formValidationSchema,
  });
  const { triggerAppAlert } = useAppAlert();

  const { value: email } = useField('email') as FieldContext<string>;
  const { value: username } = useField('username') as FieldContext<string>;
  const { value: password } = useField('password') as FieldContext<string>;

  let validationErrors = ref<any>(null);
  let httpError = ref<AppServerErrorResponse | null>(null);
  let loading = ref<boolean>(false);

  const hasFormErrors = computed(() => {
    const hasValidationErrors = Object.keys(validationErrors.value || {}).length > 0;
    const hasHttpErrors = Object.keys(httpError.value || {}).length > 0;
    return hasValidationErrors || hasHttpErrors;
  });

  const handleUserLogin = async ({ email, password }: UserLoginPayload) => {
    httpError.value = null;
    const [response, error] = await login({ email, password });
    if (error) {
      httpError.value = error.response?.data as AppServerErrorResponse;
    } else {
      triggerAppAlert({ message: 'Login successful', variant: 'success' });
    }
  };
  const handleUserSignup = async ({ email, username, password }: UserLoginPayload) => {
    httpError.value = null;
    const [response, error] = await signup({ email, username, password });
    if (error) {
      httpError.value = error.response?.data as AppServerErrorResponse;
    } else {
      triggerAppAlert({ message: 'Signup successful', variant: 'success' });
    }
  };

  const onValidationSuccess = async ({ email, username, password }: UserLoginPayload | any) => {
    loading.value = true;
    validationErrors.value = null;
    if (type === 'login') {
      await handleUserLogin({ email, password });
    }
    if (type === 'signup') {
      await handleUserSignup({ email, username, password });
    }
    loading.value = false;
  };

  const onValidationError = ({ errors }: any) => {
    validationErrors.value = errors;
  };

  const handleUserSubmit = handleSubmit(onValidationSuccess, onValidationError);

  return {
    loading,
    email,
    username,
    password,
    handleUserSubmit,
    validationErrors,
    hasFormErrors,
    httpError,
  };
}
