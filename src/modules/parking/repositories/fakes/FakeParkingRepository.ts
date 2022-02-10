import IParkingRepository from '@modules/parking/repositories/IParkingRepository';
import ICreateParkingDTO from '@modules/parking/dtos/ICreateParkingDTO';

import { ObjectID } from 'mongodb';
import Parking from '../../infra/typeorm/schemas/Parking';

export default class ParkingRepository implements IParkingRepository {
  private parking: Parking[] = [];

  public async findByID(id: ObjectID): Promise<Parking | undefined> {
    const findParking = this.parking.find(parking => parking.id === id);
    return findParking;
  }

  public async findByPlateNotExited(
    plate: string,
  ): Promise<Parking | undefined> {
    const findParking = this.parking.find(
      parking => parking.plate === plate && !parking.exitDate,
    );
    return findParking;
  }

  public async findByPlate(plate: string): Promise<Parking[]> {
    const findParking = this.parking.filter(parking => parking.plate === plate);
    return findParking;
  }

  public async save(parking: Parking): Promise<Parking> {
    const findIndex = this.parking.findIndex(
      findParking => findParking.id === parking.id,
    );

    this.parking[findIndex] = parking;

    return parking;
  }

  public async create(parkingData: ICreateParkingDTO): Promise<Parking> {
    const parking = new Parking();

    Object.assign(parking, { id: new ObjectID() }, parkingData);
    this.parking.push(parking);
    return parking;
  }
}
