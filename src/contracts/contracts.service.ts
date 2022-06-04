import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Contract } from './entities/contract.entity';

@Injectable()
export class ContractsService {
  constructor(
    @Inject('CONTRACTS_REPOSITORY')
    private contractsRepository: typeof Contract,
  ) {}

  fetchContract(id: string, profileId: string) {
    return this.contractsRepository.findOne({
      where: {
        id,
        [Op.or]: [
          {
            ClientId: profileId,
          },
          {
            ContractorId: profileId,
          },
        ],
      },
    });
  }

  findUnterminatedContracts(profileId: number) {
    return Contract.findAll({
      where: {
        [Op.or]: [
          {
            ClientId: profileId,
          },
          {
            ContractorId: profileId,
          },
        ],
        status: { [Op.ne]: 'terminated' },
      },
    });
  }
}
