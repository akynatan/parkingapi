import { getMongoRepository, MongoRepository, ObjectID } from 'typeorm';

import IParkingRepository from '@modules/parking/repositories/IParkingRepository';
import ICreateParkingDTO from '@modules/parking/dtos/ICreateParkingDTO';
import Parking from '../schemas/Parking';

export default class ParkingRepository implements IParkingRepository {
  private ormRepository: MongoRepository<Parking>;

  constructor() {
    this.ormRepository = getMongoRepository(Parking);
  }

  public async create({ plate }: ICreateParkingDTO): Promise<Parking> {
    const parking = this.ormRepository.create({
      plate,
    });
    await this.ormRepository.save(parking);
    return parking;
  }

  public async findByID(id: ObjectID): Promise<Parking | undefined> {
    const parking = await this.ormRepository.findOne(id);
    return parking;
  }

  public async findByPlateNotExited(
    plate: string,
  ): Promise<Parking | undefined> {
    const parking = await this.ormRepository.findOne({
      where: { plate, exitDate: null },
    });

    return parking;
  }

  public async findByPlate(plate: string): Promise<Parking[]> {
    const parkings = await this.ormRepository.find({
      where: { plate },
    });

    return parkings;
  }

  public async save(parking: Parking): Promise<Parking> {
    this.ormRepository.save(parking);
    return parking;
  }
}
