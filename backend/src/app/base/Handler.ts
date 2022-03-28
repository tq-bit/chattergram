import { FastifyReply, FastifyRequest } from 'fastify';
// @ts-ignore
import { JwtPayload } from 'jsonwebtoken';
import { EventEmitter } from 'events';

type HttpStatus = 200 | 201 | 204 | 400 | 404 | 500;

export type AppEventName = 'message';

export interface AppStandardResponseData {
  statusCode: HttpStatus;
  error?: string;
  msg?: string;
}

interface AppHandlerOptions {
  status?: HttpStatus;
}

export interface AppRequestSession extends JwtPayload {
  userId?: number;
}

export interface AppRequest extends FastifyRequest {
  userSession?: AppRequestSession;
}

export default class Handler extends EventEmitter {
  namespace: string;
  constructor(namespace: string) {
    super();
    this.namespace = namespace;
  }

  public getSession(req: AppRequest): AppRequestSession {
    const hasUserSession = !!req.userSession;

    if (hasUserSession) {
      return req.userSession as AppRequestSession;
    }

    throw new Error('No user session found in request');
  }
}
