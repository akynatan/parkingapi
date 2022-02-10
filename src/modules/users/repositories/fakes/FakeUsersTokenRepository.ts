import { v4 as uuid } from 'uuid';
import IUsersTokenRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '@modules/users/infra/typeorm/schemas/UserToken';

export default class UsersTokenRepository implements IUsersTokenRepository {
  private usersToken: UserToken[] = [];

  public async generate(userId: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.usersToken.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.usersToken.find(
      findToken => findToken.token === token,
    );

    return userToken;
  }
}
