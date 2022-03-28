import { reactive, ref, computed } from 'vue';
import Cookie from 'js-cookie';
import { AxiosError, AxiosResponse } from 'axios';
import client from '../api_client';
import useAppAlert from '../use/app-alert';
import { AppServerResponseOrError } from '../@types/commons';

const { triggerAppAlert } = useAppAlert();

export interface ActiveUser {
  id: number;
  email: string;
  username: string;
  bio: string;
  avatar: string;
}

export interface UserLoginPayload {
  email: string;
  username?: string;
  password: string;
}

export interface UserSession {
  user: ActiveUser;
  token: string;
}

const LOCAL_TOKEN_KEY = 'chattergram-key';

const userSchema = {
  id: 0,
  email: '',
  username: '',
  bio: '',
  avatar: '',
};

let userState: ActiveUser = reactive(userSchema);
let tokenState = ref<string>('');

/**
 * @description `useSession` provides composables to interact with the
 *              security endpoint of the Chattergram API. Use it if you need to
 *              - access the active user's state
 *              - access the API's security headers
 *              - login / logout / signup a user
 *              - destroy a local session due to 403 http stati
 */
export default function useSession() {
  const user = computed(() => userState);
  const username = computed(() => userState.username);
  const token = computed(() => tokenState.value);
  const sessionHeaders = computed(() => {
    return {
      'x-api-key': token.value,
    };
  });

  /**
   * @description Destroy the JWT from cookies and reset in-memory
   *              token and user model. Equivalent to logout, except
   *              for the HTTP request
   */
  const resetLocalSession = () => {
    Cookie.remove(LOCAL_TOKEN_KEY);
    setToken('');
    setUser(userSchema);
  };

  const setUser = (user: ActiveUser) => (userState = user);
  const setToken = (token: string) => (tokenState.value = token);
  const syncLocalApiToken = () => {
    const cookieTokenState = Cookie.get(LOCAL_TOKEN_KEY) || null;
    if (token.value !== '') {
      Cookie.set(LOCAL_TOKEN_KEY, tokenState.value);
    }

    if (!!cookieTokenState) {
      tokenState.value = cookieTokenState;
    }
  };

  const validateLocalUserState = async () => {
    try {
      const response: AxiosResponse<ActiveUser> = await client.get('/user/me', {
        headers: sessionHeaders.value,
      });
      setUser(response.data);
      return [response, null];
    } catch (error) {
      return [null, error as AxiosError];
    }
  };

  /**
   * @description Execute a http request and start a JWT user session.
   *              JWT is stored in the browser's cookies under 'chattergram-key'
   */
  const login = async (data: UserLoginPayload): Promise<AppServerResponseOrError> => {
    try {
      const response: AxiosResponse<UserSession> = await client.post('/login', data);
      setToken(response.data.token);
      setUser(response.data.user);
      syncLocalApiToken();
      return [response, null];
    } catch (error) {
      return [null, error as AxiosError];
    }
  };

  /**
   * @description Execute a http request and terminate a JWT user session.
   *              First, an attempt is made to log the user out. Errors are
   *              handled and finally the local session will be reset
   */
  const logout = async (): Promise<AppServerResponseOrError> => {
    try {
      const response = await client.post('/logout', {}, { headers: sessionHeaders.value });
      return [response, null];
    } catch (error) {
      return [null, error as AxiosError];
    } finally {
      triggerAppAlert({ message: 'You have been logged out', variant: 'success' });
      resetLocalSession();
    }
  };

  const signup = async (data: UserLoginPayload): Promise<AppServerResponseOrError> => {
    try {
      const response: AxiosResponse<UserSession> = await client.post('/signup', data);
      setToken(response.data.token);
      setUser(response.data.user);
      syncLocalApiToken();
      return [response, null];
    } catch (error) {
      return [null, error as AxiosError];
    }
  };

  return {
    user,
    username,
    token,
    sessionHeaders,
    login,
    logout,
    signup,
    resetLocalSession,
    syncLocalApiToken,
    validateLocalUserState,
  };
}
