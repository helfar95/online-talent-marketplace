import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Contract } from '../../contracts/entities/contract.entity';

@Table
export class Job extends Model {
  @Column
  description: string;

  @Column
  price: number;

  @Column
  paid: boolean;

  @Column
  paymentDate: Date

  @BelongsTo(() => Contract)
  contract: Contract

  @ForeignKey(() => Contract)
  @Column
  ContractId: number
}
