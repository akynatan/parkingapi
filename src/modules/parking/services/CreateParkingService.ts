import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Parking from '../infra/typeorm/schemas/Parking';
import IParkingRepository from '../repositories/IParkingRepository';
import ICreateParkingDTO from '../dtos/ICreateParkingDTO';

@injectable()
export default class CreateParkingService {
  constructor(
    @inject('ParkingRepository')
    private parkingRepository: IParkingRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ plate }: ICreateParkingDTO): Promise<Parking> {
    const checkPlateNotExited = await this.parkingRepository.findByPlateNotExited(
      plate,
    );

    if (checkPlateNotExited) {
      throw new AppError('Plate not exited.');
    }

    const parking = await this.parkingRepository.create({
      plate,
    });

    await this.cacheProvider.invalidate(`list-parkings:${plate}`);

    return parking;
  }
}
