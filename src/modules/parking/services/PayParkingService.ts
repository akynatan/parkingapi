import { injectable, inject } from 'tsyringe';
import { ObjectID } from 'typeorm';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Parking from '../infra/typeorm/schemas/Parking';
import IParkingRepository from '../repositories/IParkingRepository';

interface IRequest {
  id: ObjectID;
}

@injectable()
export default class PayParkingService {
  constructor(
    @inject('ParkingRepository')
    private parkingRepository: IParkingRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ id }: IRequest): Promise<Parking> {
    const parking = await this.parkingRepository.findByID(id);

    if (!parking) {
      throw new AppError('Plate not exists.');
    }

    if (parking.paid) {
      throw new AppError('Parking is already paid');
    }

    parking.paid = true;

    await this.parkingRepository.save(parking);

    await this.cacheProvider.invalidate(`list-parkings:${parking.plate}`);

    return parking;
  }
}
