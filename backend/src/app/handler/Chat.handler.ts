import Chat from '../model/Chat.model';
import { FastifyReply } from 'fastify';
import Handler, { AppRequest, AppRequestSession } from '../base/Handler';
import User from '../model/User.model';
import Uploader from '../base/Uploader';
import { Op } from 'sequelize';
import Transcriber from '../base/Transcriber';
import { UserChatResponseSchemaType, UserChatSchemaType } from '../api/schemata';
import Socket from '../base/Socket';

export interface ChatRequestParams {
  partnerId?: number;
}

export interface ChatRequest extends AppRequest {
  params: ChatRequestParams;
  body: Chat | unknown;
}

export interface ChatResponse {
  audioFile?: string | undefined;
  audioFileUuid?: string | undefined;
  audioFileName?: string | undefined;
  audioFileMimetype?: string | undefined;
  senderId: number;
  receiverId: number;
  text: string;
  dateSent: string;
}

class ChatHandler extends Handler {
  uploader: Uploader;
  socketServer: Socket;
  constructor() {
    super('chat');
    this.uploader = new Uploader();
    this.socketServer = new Socket(9090);
    this.socketServer.init();
  }

  public uploadAudioFile = async (req: AppRequest, reply: FastifyReply) => {
    const contentType = req.headers['content-type'];
    if (!contentType?.includes('multipart/form-data')) {
      return reply.badRequest('Content-type header does not include multipart/form-data');
    }
    const { files } = await this.uploader.extractForm(req);
    reply.send({ files });
  };

  public createChatEntry = async (req: AppRequest, reply: FastifyReply) => {
    const session = this.getSession(req);

    let incomingPayload = req.body as UserChatSchemaType;

    await this.checkIfChatPartnersAreEqual(reply, session.userId, incomingPayload.receiverId);
    await this.checkIfChatPartnersExist(reply, session.userId, incomingPayload.receiverId);
    await this.processAudioFileIfExists(reply, incomingPayload);

    const chatPayload: ChatResponse = await this.generateChatPayload(incomingPayload, session);

    await Chat.create({ ...chatPayload });
    this.socketServer.sendPayloadToSubscribers(chatPayload);
    return reply.send(chatPayload);
  };

  public getChatHistoryByReceiver = async (req: ChatRequest, reply: FastifyReply) => {
    const { userId } = this.getSession(req);
    const partnerId = this.getChatPartnerId(req);

    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId },
        ],
      },
    });
    return reply.send(chats);
  };

  private processAudioFileIfExists = async (
    reply: FastifyReply,
    payload: UserChatSchemaType
  ): Promise<UserChatSchemaType | void> => {
    const payloadHasAudioFile: boolean = !!payload.audioFile;
    const audioFileWasUploaded: boolean = !!this.uploader.getFilePathByUuid(
      payload.audioFile?.uuid
    );

    if (payloadHasAudioFile && audioFileWasUploaded) {
      payload = await this.decoratePayloadWithDeepgramTranscript(payload);
    }

    if (payloadHasAudioFile && !audioFileWasUploaded) {
      return reply.notFound(
        `File with id ${payload.audioFile?.uuid} was not uploaded or does not exist anymore`
      );
    }
    return payload;
  };

  private decoratePayloadWithDeepgramTranscript = async (payload: UserChatSchemaType) => {
    const uuid = payload.audioFile?.uuid;
    const mimetype = payload.audioFile?.mimetype || '';

    const path = this.uploader.getFilePathByUuid(uuid);
    const transcriber = new Transcriber(path, mimetype);

    const response = await transcriber.translateFromLocalFile();
    payload.text = response?.transcript || '';
    payload.confidence = response?.confidence || 0;
    return payload;
  };

  /**
   * @desc  This function may only be called once the fileupload and transcript decoration
   *        have been processed entirely
   */
  private generateChatPayload = async (
    incomongPayload: UserChatSchemaType,
    session: AppRequestSession
  ): Promise<UserChatResponseSchemaType> => {
    let payload: UserChatResponseSchemaType = {
      senderId: session.userId || incomongPayload.senderId,
      receiverId: incomongPayload.receiverId,
      // @ts-ignore Typebox does not recognize date
      dateSent: new Date(),
      text: incomongPayload.text,
      confidence: incomongPayload.confidence
    };

    if (incomongPayload.audioFile) {
      const audioFileBuffer = await this.uploader.getFileStringByUuid(
        incomongPayload.audioFile?.uuid
      );
      payload = {
        ...payload,
        audioFile: audioFileBuffer,
        audioFileUuid: incomongPayload.audioFile?.uuid,
        audioFileName: incomongPayload.audioFile?.name,
        audioFileMimetype: incomongPayload.audioFile?.mimetype,
      };
    }
    return payload;
  };

  private getChatPartnerId = (req: ChatRequest) => {
    return req.params.partnerId;
  };

  private checkIfChatPartnersAreEqual = async (
    reply: FastifyReply,
    senderId?: number,
    receiverId?: number
  ) => {
    if (senderId === receiverId) {
      return reply.badRequest('Sender and receiver cannot be equal');
    }
  };

  private checkIfChatPartnersExist = async (
    reply: FastifyReply,
    senderId?: number,
    receiverId?: number
  ) => {
    const chatPartners = await User.findAll({
      where: {
        [Op.or]: [{ id: senderId }, { id: receiverId }],
      },
    });

    if (chatPartners.length === 2) {
      return true;
    }

    return reply.notFound("One of the two chat partners doesn't exist");
  };
}

export default new ChatHandler();
