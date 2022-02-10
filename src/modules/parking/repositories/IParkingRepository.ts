import { ObjectID } from 'typeorm';
import ICreateParkingDTO from '../dtos/ICreateParkingDTO';
import Parking from '../infra/typeorm/schemas/Parking';

export default interface IParkingRepository {
  create(data: ICreateParkingDTO): Promise<Parking>;
  findByID(id: ObjectID): Promise<Parking | undefined>;
  findByPlateNotExited(plate: string): Promise<Parking | undefined>;
  findByPlate(plate: string): Promise<Parking[]>;
  save(user: Parking): Promise<Parking>;
}
