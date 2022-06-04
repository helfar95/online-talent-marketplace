import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { DatabaseModule } from '../database.module';
import { contractsProviders } from './contracts.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ContractsController],
  providers: [ContractsService, ...contractsProviders]
})
export class ContractsModule {}
