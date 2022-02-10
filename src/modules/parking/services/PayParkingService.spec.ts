import { ObjectID } from 'typeorm';
import { ObjectId } from 'mongodb';

import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeParkingRepository from '../repositories/fakes/FakeParkingRepository';
import CreateParkingService from './CreateParkingService';
import PayParkingService from './PayParkingService';

let fakeCacheProvider: FakeCacheProvider;
let fakeParkingRepository: FakeParkingRepository;
let createParkingService: CreateParkingService;
let payParkingService: PayParkingService;
const objectId = (new ObjectId() as any) as ObjectID;

describe('PayParkingService', () => {
  beforeEach(() => {
    fakeParkingRepository = new FakeParkingRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createParkingService = new CreateParkingService(
      fakeParkingRepository,
      fakeCacheProvider,
    );
    payParkingService = new PayParkingService(
      fakeParkingRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to pay parking', async () => {
    const parkingCreated = await createParkingService.execute({
      plate: 'AAA-1234',
    });

    const parkingPaid = await payParkingService.execute({
      id: parkingCreated.id,
    });

    await expect(parkingPaid).toHaveProperty('id');
  });

  it('should not be able to pay parking with plate not exists', async () => {
    await expect(
      payParkingService.execute({
        id: objectId,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able pay for parking that is already paid', async () => {
    const parkingCreated = await createParkingService.execute({
      plate: 'AAA-1234',
    });

    await payParkingService.execute({
      id: parkingCreated.id,
    });

    await expect(
      payParkingService.execute({
        id: parkingCreated.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
