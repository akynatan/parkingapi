import { ObjectID } from 'typeorm';
import { ObjectId } from 'mongodb';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeParkingRepository from '../repositories/fakes/FakeParkingRepository';
import CreateParkingService from './CreateParkingService';
import PayParkingService from './PayParkingService';
import OutCarService from './OutCarService';

let fakeCacheProvider: FakeCacheProvider;
let fakeParkingRepository: FakeParkingRepository;
let createParkingService: CreateParkingService;
let payParkingService: PayParkingService;
let outCarService: OutCarService;
let fakeMailProvider: FakeMailProvider;
const objectId = (new ObjectId() as any) as ObjectID;

describe('OutCarService', () => {
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
    fakeMailProvider = new FakeMailProvider();
    outCarService = new OutCarService(
      fakeParkingRepository,
      fakeCacheProvider,
      fakeMailProvider,
    );
  });

  it('should be able to out parking', async () => {
    const parkingCreated = await createParkingService.execute({
      plate: 'AAA-1234',
    });

    await payParkingService.execute({
      id: parkingCreated.id,
    });

    const parkingLeft = await outCarService.execute({
      id: parkingCreated.id,
    });

    await expect(parkingLeft).toHaveProperty('id');
  });

  it('should not be able to out parking to plate not exists', async () => {
    await expect(
      outCarService.execute({
        id: objectId,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able out for parking that is already exited', async () => {
    const parkingCreated = await createParkingService.execute({
      plate: 'AAA-1234',
    });

    await payParkingService.execute({
      id: parkingCreated.id,
    });

    await outCarService.execute({
      id: parkingCreated.id,
    });

    await expect(
      outCarService.execute({
        id: parkingCreated.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to out parking not paid', async () => {
    const parkingCreated = await createParkingService.execute({
      plate: 'AAA-1234',
    });

    await expect(
      outCarService.execute({
        id: parkingCreated.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
