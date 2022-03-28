import { ComputedRef, ref } from 'vue';
import { ChatHistoryItem } from '../store/chat';
import useSession from '../store/session';
import { PublicUser } from '../store/users';
import useLogger from './logger';

const { token, user } = useSession();
const { log } = useLogger('development');

let socketStatus = ref<'open' | 'closed'>('closed');

export default function useWebsocket(
  socketUrl: string,
  subscriptionHandler: any,
  chatPartner: ComputedRef<PublicUser>
) {
  if (!token) {
    log('You forgot to create a session. Call useWebsocket only after creating a JWT', 'error');
    throw new Error('Cannot open socket connection without session JWT');
  }

  let socket = ref<WebSocket | null>(null);

  const handleSocketMessage = (chatPayload: ChatHistoryItem) => {
    const isValidChatPayload = !!chatPayload.receiverId && !!chatPayload.senderId;
    if (isValidChatPayload) {
      const { senderId, receiverId } = chatPayload;
      log(`Sender: Message from EQ ${senderId} to ${receiverId}`, 'info');

      const activeUserIsChatSender = +user.value.id === +senderId;
      const activeUserIsChatReceiver = +user.value.id === +receiverId;
      const chatPartnerIsChatSender = +chatPartner.value.id === +senderId;
      if (activeUserIsChatSender || (activeUserIsChatReceiver && chatPartnerIsChatSender)) {
        subscriptionHandler(chatPayload);
      }
    }
  };
  const connect = () => {
    socket.value = new WebSocket(`${socketUrl}/?token=${token.value}`);

    socket.value.addEventListener('open', () => {
      log('Opened Websocket', 'info');
      socketStatus.value = 'open';
    });

    socket.value.addEventListener('close', () => {
      log('Closed websocket', 'warn');
      socketStatus.value = 'closed';
    });

    socket.value.addEventListener('message', (ev) => {
      const chatPayload: ChatHistoryItem = JSON.parse(ev.data);
      handleSocketMessage(chatPayload);
    });
  };

  const close = () => {
    if (socket.value) {
      socket.value.close();
    }
  };

  return { socketStatus, connect, close };
}
