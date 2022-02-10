import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateParkingService from '@modules/parking/services/CreateParkingService';
import OutCarService from '@modules/parking/services/OutCarService';
import PayParkingService from '@modules/parking/services/PayParkingService';
import ListHistoricPlateService from '@modules/parking/services/ListHistoricPlateService';

export default class ParkingController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { plate } = request.body;

    const CreateParking = container.resolve(CreateParkingService);

    const parking = await CreateParking.execute({
      plate,
    });

    return response.json(parking);
  }

  public async out(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { email } = request.body;

    const OutCar = container.resolve(OutCarService);

    const parking = await OutCar.execute({
      id,
      email,
    });

    return response.json(parking);
  }

  public async pay(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const PayParking = container.resolve(PayParkingService);

    const parking = await PayParking.execute({
      id,
    });

    return response.json(parking);
  }

  public async listHistoricPlate(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { plate } = request.params;

    const ListHistoricPlate = container.resolve(ListHistoricPlateService);

    const parking = await ListHistoricPlate.execute({
      plate,
    });

    return response.json(parking);
  }
}
