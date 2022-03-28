import axios, { AxiosError } from 'axios';
import useSession from '../src/store/session';
import useLogger from './use/logger';
import useAppAlert from './use/app-alert';

const { resetLocalSession } = useSession();
const { triggerAppAlert } = useAppAlert();
const { log } = useLogger('development');

const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:8080/api/'
    : 'https://chat.q-bit.me/api/';

const client = axios.create({
  baseURL: BASE_URL,
  validateStatus: (status: number) => {
    return status >= 200 && status < 300;
  },
});

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!!error.response && error.response.status === 403) {
      log('Serverside JWT validation failed. Resetting local session', 'warn');
      triggerAppAlert(
        { message: 'Session expired! Please log in to continue.', variant: 'info' },
        5000
      );
      resetLocalSession();
    }
    if (error) throw error;
  }
);

export default client;
