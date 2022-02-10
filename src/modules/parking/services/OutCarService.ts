import { injectable, inject } from 'tsyringe';
import { ObjectID } from 'typeorm';
import path from 'path';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import { differenceInMinutes } from 'date-fns';
import Parking from '../infra/typeorm/schemas/Parking';
import IParkingRepository from '../repositories/IParkingRepository';

interface IRequest {
  id: ObjectID;
  email: string | undefined;
}

@injectable()
export default class OutCarService {
  constructor(
    @inject('ParkingRepository')
    private parkingRepository: IParkingRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({ id, email }: IRequest): Promise<Omit<Parking, 'a'>> {
    const parking = await this.parkingRepository.findByID(id);

    if (!parking) {
      throw new AppError('Plate not exists.');
    }

    if (parking.exitDate) {
      throw new AppError('Car has left the parking lot');
    }

    if (!parking.paid) {
      throw new AppError('Plate not paid');
    }

    const certificateParkingTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'certificate_parking.hbs',
    );

    parking.exitDate = new Date();

    await this.parkingRepository.save(parking);

    if (email && parking.exitDate) {
      const time = `${differenceInMinutes(
        new Date(parking.exitDate),
        new Date(parking.createdAt),
      )} minutes`;

      await this.mailProvider.sendEmail({
        to: {
          name: 'email',
          email,
        },
        subject: '[Parking] Comprovante de Estacionamento',
        templateData: {
          file: certificateParkingTemplate,
          variables: {
            plate: parking.plate,
            time,
          },
        },
      });
    }

    await this.cacheProvider.invalidate(`list-parkings:${parking.plate}`);

    return parking;
  }
}
