import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Contract } from '../../contracts/entities/contract.entity';

export enum ProfileType {
  CLIENT = 'client',
  CONTRACT = 'contractor',
}

@Table
export class Profile extends Model {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  profession: string;

  @Column
  balance: number;

  @Column({ type: DataType.ENUM({ values: Object.keys(ProfileType) }) })
  type: ProfileType;

  @HasMany(() => Contract, 'ContractorId')
  contractors: Contract[]

  @HasMany(() => Contract, 'ClientId')
  clients: Contract[]
}
