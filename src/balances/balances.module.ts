import { Module } from '@nestjs/common';
import { JobsService } from '../jobs/jobs.service';
import { DatabaseModule } from '../database.module';
import { jobsProviders } from '../jobs/jobs.providers';
import { BalancesController } from './balances.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [BalancesController],
  providers: [JobsService,  ...jobsProviders]
})
export class BalancesModule {}
