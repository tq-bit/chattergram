import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import ChatHandler, { ChatRequestParams } from '../../handler/Chat.handler';
import {
  UserChatSchema,
  UserChatSchemaType,
  StaticSecuritySchema,
  UserUploadResponseSchema,
  UserChatResponseSchema,
  UserChatResponseSchemaType,
} from '../schemata';
import SecurityHandler from '../../handler/Security.handler';

const chatRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  opts: Record<never, never>,
  done: (err?: Error | undefined) => void
) => {
  fastify.post('/upload', {
    schema: {
      security: StaticSecuritySchema,
      description: `Upload an audio file and receive a UUID back to add to the next client's \`/chat\` message. The file upload will be available for **${
        process.env.BACKEND_FILE_LIFESPAN ? +process.env.BACKEND_FILE_LIFESPAN / 1000 : 60
      } seconds** to be processed.`,
      response: {
        200: UserUploadResponseSchema,
      },
    },
    preHandler: fastify.auth([SecurityHandler.authenticate]),
    handler: ChatHandler.uploadAudioFile,
  });

  fastify.post<{ Body: UserChatSchemaType; Reply: UserChatSchemaType }>('/chat', {
    schema: {
      security: StaticSecuritySchema,
      body: UserChatSchema,
      response: {
        200: UserChatResponseSchema,
      },
    },
    preHandler: fastify.auth([SecurityHandler.authenticate]),
    handler: ChatHandler.createChatEntry,
  });

  fastify.get<{ Params: ChatRequestParams; Reply: UserChatResponseSchemaType }>(
    '/chat/:partnerId',
    {
      schema: {
        security: StaticSecuritySchema,
        params: {
          partnerId: {
            type: 'number',
          },
        },
        response: {
          200: {
            type: 'array',
            items: UserChatResponseSchema,
          },
        },
      },
      preHandler: fastify.auth([SecurityHandler.authenticate]),
      handler: ChatHandler.getChatHistoryByReceiver,
    }
  );
  done();
};

export default chatRoutes;
