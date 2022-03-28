import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import SecurityHandler from '../../handler/Security.handler';
import {
  SignupFormSchema,
  SignupFormSchemaType,
  LoginResponseSchema,
  LoginResponseSchemaType,
  LoginFormSchema,
  StaticSecuritySchema,
} from '../schemata';

const securityRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  opts: Record<never, never>,
  done: (err?: Error | undefined) => void
) => {
  fastify.post<{ Body: SignupFormSchemaType; Reply: LoginResponseSchemaType }>('/signup', {
    schema: {
      body: SignupFormSchema,
      response: {
        200: LoginResponseSchema,
      },
    },
    handler: SecurityHandler.signup,
  });

  fastify.post<{ Body: SignupFormSchemaType; Reply: LoginResponseSchemaType }>('/login', {
    schema: {
      body: LoginFormSchema,
      response: {
        200: LoginResponseSchema,
      },
    },
    handler: SecurityHandler.login,
  });

  fastify.post<{ Body: SignupFormSchemaType; Reply: LoginResponseSchemaType }>('/logout', {
    schema: {
      security: StaticSecuritySchema,
    },
    preHandler: fastify.auth([SecurityHandler.authenticate]),
    handler: SecurityHandler.logout,
  });
  done();
};

export default securityRoutes;
