import { ObjectID } from 'typeorm';

export default interface IListHistoricByPlate {
  id: ObjectID;
  paid: boolean;
  left: boolean;
  time: string;
}
