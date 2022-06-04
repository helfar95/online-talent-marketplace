import { Contract } from '../contracts/entities/contract.entity';
import { Job } from './entities/job.entity';

export const jobsProviders = [
  {
    provide: 'JOBS_REPOSITORY',
    useValue: Job,
  },
];
