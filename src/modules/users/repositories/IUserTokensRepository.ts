import UserToken from '../infra/typeorm/schemas/UserToken';

export default interface IUserTokensRepository {
  generate(userId: string): Promise<UserToken>;
  findByToken(token: string): Promise<UserToken | undefined>;
}
