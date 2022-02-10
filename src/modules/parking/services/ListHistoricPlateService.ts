import { injectable, inject } from 'tsyringe';
import { differenceInMinutes } from 'date-fns';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IParkingRepository from '../repositories/IParkingRepository';
import IListHistoricByPlate from '../dtos/IListHistoricByPlate';

interface IRequest {
  plate: string;
}

@injectable()
export default class ListHistoricPlateService {
  constructor(
    @inject('ParkingRepository')
    private parkingRepository: IParkingRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ plate }: IRequest): Promise<IListHistoricByPlate[]> {
    let parkings = await this.cacheProvider.recover<IListHistoricByPlate[]>(
      `list-parkings:${plate}`,
    );

    if (!parkings) {
      const parkingsDB = await this.parkingRepository.findByPlate(plate);

      parkings = parkingsDB.map(parking => {
        const date = parking.exitDate ? new Date(parking.exitDate) : new Date();
        const time = `${differenceInMinutes(
          date,
          new Date(parking.createdAt),
        )} minutes`;

        return {
          id: parking.id,
          paid: parking.paid,
          left: !!parking.exitDate,
          time,
        };
      });

      await this.cacheProvider.save(`list-parkings:${plate}`, parkings);
    }

    return parkings;
  }
}
