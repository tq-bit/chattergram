import { Op } from 'sequelize';
import Security from '../model/Security.model';
import User from '../model/User.model';
// @ts-ignore
import bcrypt from 'bcrypt';
// @ts-ignore
import jwt, { SignOptions } from 'jsonwebtoken';
import Handler, { AppRequest, AppRequestSession } from '../base/Handler';
import { FastifyReply } from 'fastify';
import { LoginFormSchemaType, SignupFormSchemaType } from '../api/schemata';

class SecurityHandler extends Handler {
  secret: string;
  signOptions: SignOptions;
  saltRounds: number;
  constructor(signOptions?: SignOptions, saltRounds?: number) {
    super('security');
    this.secret = process.env.BACKEND_JWT_SECRET || 'supersecret456';
    this.signOptions = signOptions || {
      audience: 'deepgram-app',
      expiresIn: '4h',
    };
    this.saltRounds = saltRounds || 12;
  }

  public signup = async (req: AppRequest, reply: FastifyReply) => {
    const { email, password, username } = req.body as SignupFormSchemaType;
    const userExists = await this.handleDoubleUserCheck(username, email);
    if (userExists) {
      return reply.badRequest('User with this email or name already exists');
    }
    return await this.handleUserSignup(reply, username, email, password);
  };

  public login = async (req: AppRequest, reply: FastifyReply) => {
    const { email, password } = req.body as LoginFormSchemaType;
    // FIXME: Send proper message back to client when user does not exist
    const user = await this.handleUserExistsCheck(reply, email);
    if (user) {
      await this.handleUserCredentialsCheck(reply, user, password);
      return await this.handleUserLogin(reply, user);
    }
  };

  public logout = async (req: AppRequest, reply: FastifyReply) => {
    try {
      const { userId } = this.getSession(req);
      await User.update({ online: false }, { where: { id: userId } });
      return reply.send({ msg: 'Logout successful' });
    } catch (error) {
      req.log.error(error);
      return reply.send({ msg: 'Could not log user out' });
    }
  };

  public authenticate = (
    req: AppRequest,
    reply: FastifyReply,
    done: (error?: Error | undefined) => void
  ) => {
    try {
      const payload = this.extractJwtPayloadFromRequest(req);
      req.userSession = payload;
      done();
    } catch (error) {
      req.log.error(error);
      return reply.forbidden();
    }
  };

  private signJwt(payload: AppRequestSession) {
    return jwt.sign(payload, this.secret, this.signOptions);
  }

  public verifyJwt(token: string): AppRequestSession {
    return jwt.verify(token, this.secret) as AppRequestSession;
  }

  private extractJwtPayloadFromRequest(req: AppRequest): AppRequestSession {
    const token: string = (req.headers['x-api-key'] as string) || '';
    const payload = this.verifyJwt(token);
    return payload;
  }

  private handleDoubleUserCheck = async (username: string, email: string) => {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: email }],
      },
    });
    if (existingUser) {
      return true;
    }
    return false;
  };

  private handleUserExistsCheck = async (reply: FastifyReply, email: string) => {
    const existingUser = await User.findOne({ where: { email } });
    if (!existingUser) {
      return reply.notFound('User - password combination not found');
    }
    return existingUser;
  };

  private handleUserCredentialsCheck = async (
    reply: FastifyReply,
    user: User,
    password: string
  ) => {
    const authEntry = await Security.findOne({ where: { userId: user.id } });
    if (!authEntry) {
      return reply.internalServerError('Consistency error: No auth entry found for user');
    }

    const isPwMatch = this.comparePasswords(password, authEntry.password);
    if (!isPwMatch) {
      return reply.notFound('User - password combination not found');
    }
    return true;
  };

  private handleUserSignup = async (
    reply: FastifyReply,
    username: string,
    email: string,
    password: string
  ) => {
    const newUserEntry = await User.create({ username, email, online: false });
    const passwordHash = await this.encryptPassword(password);
    const newAuthEntry = await Security.create({
      userId: newUserEntry.id,
      password: passwordHash,
    });

    const token = this.signJwt({ userId: newUserEntry.id });
    return reply.send({ user: newUserEntry, token });
  };

  private handleUserLogin = async (reply: FastifyReply, user: User) => {
    await User.update({ online: true }, { where: { id: user.id } });
    const token = this.signJwt({ userId: user.id });
    return reply.send({ user, token });
  };

  private comparePasswords = async (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
  };

  private encryptPassword = async (password: string): Promise<string> => {
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  };
}

export default new SecurityHandler();
