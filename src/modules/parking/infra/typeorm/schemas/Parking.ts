/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ObjectID,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
  BeforeInsert,
} from 'typeorm';

@Entity('parking')
class Parking {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  plate: string;

  @Column()
  exitDate!: Date | null;

  @Column({ default: false })
  paid = false;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  beforeInsertActions() {
    this.exitDate = null;
  }
}

export default Parking;
