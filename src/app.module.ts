import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContractsModule } from './contracts/contracts.module';
import { GetProfileMiddleware } from './get-profile.middleware';
import { JobsModule } from './jobs/jobs.module';
import { ProfilesModule } from './profiles/profiles.module';
import { BalancesController } from './balances/balances.controller';
import { BalancesModule } from './balances/balances.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ContractsModule, JobsModule, ProfilesModule, BalancesModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GetProfileMiddleware)
      .forRoutes('contracts', 'jobs');
  }
}
