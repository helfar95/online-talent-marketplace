import { Contract } from './entities/contract.entity';

export const contractsProviders = [
  {
    provide: 'CONTRACTS_REPOSITORY',
    useValue: Contract,
  },
];
