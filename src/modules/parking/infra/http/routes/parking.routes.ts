import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ParkingController from '../controllers/ParkingController';

const parkingRouter = Router();
parkingRouter.use(ensureAuthenticated);
const parkingController = new ParkingController();

parkingRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      plate: Joi.string()
        .required()
        .regex(/^[a-zA-Z]{3}-[0-9]{4}$/),
    },
  }),
  parkingController.create,
);

parkingRouter.put(
  '/:id/out',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  parkingController.out,
);

parkingRouter.put(
  '/:id/pay',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  parkingController.pay,
);

parkingRouter.get(
  '/:plate',
  celebrate({
    [Segments.PARAMS]: {
      plate: Joi.string()
        .required()
        .regex(/^[a-zA-Z]{3}-[0-9]{4}$/),
    },
  }),
  parkingController.listHistoricPlate,
);

export default parkingRouter;
