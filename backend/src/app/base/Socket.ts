import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import SecurityHandler from '../handler/Security.handler';
import User from '../model/User.model';
import { ChatResponse } from '../handler/Chat.handler';

/**
 * - A Token must be passed as part of the URL from the client to the serverside
 * - This token is received and identifier, then decoded and verified
 * - The userId will be used to identify the socket to which messages are to be sent
 */

export interface SocketSubscriber {
  userId: number;
  token: string;
  socket: WebSocket;
}

class Socket {
  port: number;
  server: WebSocketServer;
  subscribers: SocketSubscriber[];

  constructor(port: number) {
    this.port = port || 9090;
    this.server = new WebSocketServer({ port: this.port });
    this.subscribers = [];
  }

  public init() {
    this.server.on('connection', async (socket: WebSocket, request: IncomingMessage) => {
      try {
        const userId = await this.registerSubscriber(request, socket);
        socket.send(JSON.stringify({ msg: `Connected with userId ${userId}` }));
        socket.on('close', async () => await this.unregisterSubscriber(userId));
      } catch (error) {
        console.error(error);
        socket.close();
      }
    });
  }

  public sendPayloadToSubscribers(payload: ChatResponse) {
    try {
      const sender = this.getSubscriberById(payload.senderId);
      const receiver = this.getSubscriberById(payload.receiverId);

      console.log(`Message from ${payload.senderId} to ${payload.receiverId}`);

      sender?.socket.send(JSON.stringify(payload));
      receiver?.socket.send(JSON.stringify(payload));
    } catch (error) {
      console.error(error);
    }
  }

  private registerSubscriber = async (
    request: IncomingMessage,
    socket: WebSocket
  ): Promise<number> => {
    const token = this.getTokenFromUrl(request.url);
    const session = SecurityHandler.verifyJwt(token);
    if (!token || !session.userId) {
      throw new Error('Invalid token or session data');
    }

    const isSubscribed = this.subscribers.find(
      (subscriber) => subscriber.userId === session.userId
    );
    if (!isSubscribed) {
      const newSubscriber = { userId: session.userId, socket, token };
      this.subscribers = [...this.subscribers, newSubscriber];
    }

    await User.update({ online: true }, { where: { id: session.userId } });

    return session.userId;
  };

  private unregisterSubscriber = async (userId: number) => {
    this.subscribers = this.subscribers.filter((subscriber) => subscriber.userId !== userId);
    await User.update({ online: false }, { where: { id: userId } });
  };

  private getSubscriberById(receiverId: number): SocketSubscriber | undefined {
    const subscriber = this.subscribers.find((subscriber) => subscriber.userId === receiverId);
    if (subscriber) {
      return subscriber;
    } else {
      console.log(`Subscriber with id ${receiverId} is not logged in. Skipping`);
    }
  }

  private getTokenFromUrl(url: string | undefined): string {
    const tokenIdentifier = '/?token=';
    if (url && url.includes(tokenIdentifier)) {
      return url.split(tokenIdentifier)[1];
    }
    throw new Error(`${tokenIdentifier} must be part of the socket URL!`);
  }
}

export default Socket;
