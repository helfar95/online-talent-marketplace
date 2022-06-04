import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { DatabaseModule } from '../database.module';
import { profilesProviders } from './contracts.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ProfilesController],
  providers: [ProfilesService, ...profilesProviders]
})
export class ProfilesModule {}
