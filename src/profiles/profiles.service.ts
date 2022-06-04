import { Inject, Injectable } from '@nestjs/common';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject('PROFILES_REPOSITORY')
    private profilesRepository: typeof Profile
  ) {}
}
