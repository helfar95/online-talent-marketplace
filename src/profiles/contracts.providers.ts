import { Profile } from './entities/profile.entity';

export const profilesProviders = [
  {
    provide: 'PROFILES_REPOSITORY',
    useValue: Profile,
  },
];
