import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { DatabaseModule } from '../database.module';
import { jobsProviders } from './jobs.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [JobsController],
  providers: [JobsService,  ...jobsProviders]
})
export class JobsModule {}
