import ICreateUserDTO from '../dtos/ICreateUserDTO';
import User from '../infra/typeorm/schemas/User';

export default interface IUsersRepository {
  findByID(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
