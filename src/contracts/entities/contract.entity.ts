import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Job } from '../../jobs/entities/job.entity';
import { Profile } from '../../profiles/entities/profile.entity';

export enum ContractStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  TERMINATED = 'terminated',
}

@Table
export class Contract extends Model {
  @Column
  terms: string;

  @Column({ type: DataType.ENUM({ values: Object.keys(ContractStatus) }) })
  status: ContractStatus;

  @BelongsTo(() => Profile, 'ContractorId')
  contractor: Profile

  @BelongsTo(() => Profile, 'ClientId')
  client: Profile

  @ForeignKey(() => Profile)
  @Column
  ContractorId: number

  @ForeignKey(() => Profile)
  @Column
  ClientId: number

  @HasMany(() => Job)
  jobs: Job[]
}
