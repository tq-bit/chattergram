import User from '../model/User.model';
import { FastifyReply } from 'fastify';
import Handler, { AppRequest } from '../base/Handler';

class UserHandler extends Handler {
  constructor() {
    super('user');
  }

  public getUserList = async (req: AppRequest, reply: FastifyReply) => {
    const users = await User.findAll();
    return reply.send(users);
  };

  public getActiveUser = async (req: AppRequest, reply: FastifyReply) => {
    const { userId } = this.getSession(req);
    const user = await User.findOne({ where: { id: userId } });
    return reply.send(user);
  };

  public updateActiveUser = async (req: AppRequest, reply: FastifyReply) => {
    const { userId } = this.getSession(req);
    const payload: User = req.body as User;
    await User.update(payload, { where: { id: userId } });
    const user = await User.findOne({ where: { id: userId } });
    return reply.send(user);
  };
}

export default new UserHandler();
