import { ref, computed } from 'vue';
import { AxiosError } from 'axios';
import useUsers from './users';
import client from '../api_client';
import useSession from './session';
import useLogger from '../use/logger';
import useWebsocket from '../use/websocket';
import useAppAlert from '../use/app-alert';
import { AppServerResponseOrError } from '../@types/commons';

const { log } = useLogger();
const { sessionHeaders, user: activeUser } = useSession();
const { chatPartner } = useUsers();
const { triggerAppAlert } = useAppAlert();

const WS_BASE_URL =
  import.meta.env.MODE === 'development' ? 'ws://localhost:9090' : 'wss://chat.q-bit.me/ws';
export interface FileSchema {
  uuid: string;
  name: string;
  mimetype: string;
}

export interface ChatFormItem {
  senderId: number;
  receiverId: number;
  audioFile?: FileSchema;
  text: string;
}

export interface ChatHistoryItem {
  senderId: number;
  receiverId: number;
  dateSent: string;
  audioFile: string;
  audioFileUuid: string;
  audioFileName: string;
  audioFileMimetype: string;
  text: string;
  confidence: number;
}

let chatState = ref<ChatHistoryItem[]>([]);

/**
 * @description useChat is to be used for a single user only and can only be
 *              initialized when a chat partner from `useUsers` has been defined.
 */
export default function useChat() {
  if (!chatPartner.value) {
    log('No chat partner defined before initializing useChat', 'error');
    log('Make sure to set a chat partner with useUsers before using this composable', 'error');
  }

  const chatHistory = computed(() => chatState.value);
  let loading = ref<boolean>(false);

  const setChatHistory = (chatHistory: ChatHistoryItem[]) => {
    chatState.value = chatHistory;
  };

  const addToChatHistory= (payload: ChatHistoryItem) => {
    chatState.value.push(payload);
  }
  const { connect, socketStatus, close } = useWebsocket(WS_BASE_URL, addToChatHistory, chatPartner);

  const fetchChatHistory = async (): Promise<AppServerResponseOrError> => {
    if (!chatPartner.value) throw new Error('No chat partner defined');
    try {
      loading.value = true;
      const response = await client.get(`/chat/${chatPartner.value.id}`, {
        headers: sessionHeaders.value,
      });
      setChatHistory(response.data);
      return [response, null];
    } catch (error) {
      log(error as string, 'error');
      triggerAppAlert({
        message: 'Something went wrong while receiving messages' + error,
        variant: 'error',
      });
      return [null, error as AxiosError];
    } finally {
      loading.value = false;
    }
  };

  const createChatItem = async (text: string, fileInfo?: FileSchema) => {
    if (!chatPartner.value) throw new Error('No chat partner defined');
    try {
      const payload: ChatFormItem = {
        receiverId: chatPartner.value.id,
        senderId: activeUser.value.id,
        audioFile: fileInfo,
        text: text,
      };

      const response = await client.post(`/chat`, payload, { headers: sessionHeaders.value });
      return [response, null];
    } catch (error) {
      log(error as string, 'error');
      triggerAppAlert({
        message: 'Something went wrong while posting a chat message',
        variant: 'error',
      });
      return [null, error as AxiosError];
    }
  };

  const uploadRecordedFile = async (file: Blob): Promise<AppServerResponseOrError> => {
    try {
      const form = new FormData();
      form.append('audioFile', file);
      const response = await client.post('/upload', form, { headers: sessionHeaders.value });
      form.delete('audioFile');

      return [response, null];
    } catch (error) {
      log(error as string, 'error');
      triggerAppAlert({
        message: 'Something went wrong while uploading the audio file',
        variant: 'error',
      });
      return [null, error as AxiosError];
    }
  };

  const createChatItemWithRecordedFile = async (
    file: Blob | null | undefined
  ): Promise<AppServerResponseOrError> => {
    if (!file) throw new Error('Must provide a file to upload');
    loading.value = true;
    const [fileResponse, fileError] = await uploadRecordedFile(file);
    const fileInfo: FileSchema = fileResponse?.data.files[0];
    const [response, chatError] = await createChatItem('', fileInfo);
    loading.value = false;
    return [response, fileError || chatError || null] as AppServerResponseOrError;
  };

  return {
    loading,
    chatHistory,
    createChatItem,
    createChatItemWithRecordedFile,
    fetchChatHistory,
    connect,
    close,
    socketStatus,
  };
}
