import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeParkingRepository from '../repositories/fakes/FakeParkingRepository';
import CreateParkingService from './CreateParkingService';

let fakeParkingRepository: FakeParkingRepository;
let fakeCacheProvider: FakeCacheProvider;
let createParkingService: CreateParkingService;

describe('CreateParking', () => {
  beforeEach(() => {
    fakeParkingRepository = new FakeParkingRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createParkingService = new CreateParkingService(
      fakeParkingRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new parking', async () => {
    const parking = await createParkingService.execute({
      plate: 'AAA-1234',
    });

    await expect(parking).toHaveProperty('id');
  });

  it('should not be able to create a new parking lot with the same license plate when it has not yet left', async () => {
    await createParkingService.execute({
      plate: 'AAA-1234',
    });

    await expect(
      createParkingService.execute({
        plate: 'AAA-1234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
