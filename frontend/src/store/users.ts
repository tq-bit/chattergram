import { ref, computed } from 'vue';
import { AxiosError } from 'axios';
import client from '../api_client';
import useSession from './session';
import { AppServerResponseOrError } from '../@types/commons';

const { sessionHeaders } = useSession();

export interface PublicUser {
  id: number;
  username: string;
  bio: string;
  avatar: string;
  online: boolean;
}

const usersSchema = [
  {
    id: 0,
    username: 'Grammy',
    bio: '404 bio not found',
    avatar: '',
    online: true,
  },
];

let usersState = ref<PublicUser[]>(usersSchema);
let chatPartnerState = ref<PublicUser | null>(null);

export default function useUsers() {
  const users = computed(() => usersState.value);
  const chatPartner = computed(() => chatPartnerState.value || usersSchema[0]);

  const setUsers = (users: PublicUser[]) => {
    usersState.value = users;
  };
  const setChatpartner = (chatPartner: PublicUser) => {
    chatPartnerState.value = chatPartner;
  };

  const fetchUsers = async (): Promise<AppServerResponseOrError> => {
    try {
      const response = await client.get('/user/list', { headers: sessionHeaders.value });
      setUsers(response.data);
      return [response, null];
    } catch (error) {
      return [null, error as AxiosError];
    }
  };

  return { users, fetchUsers, chatPartner, setChatpartner };
}
