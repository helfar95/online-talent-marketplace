import { Controller, Get, NotFoundException, Param, Request } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { Contract } from './entities/contract.entity';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  async findUnterminatedContracts(@Request() request) {
    let contracts: Contract[] = await this.contractsService.findUnterminatedContracts(request.profile.id);

    return { contracts };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() request) {
    let contract: Contract = await this.contractsService.fetchContract(id, request.profile.id);
    if (!contract) {
      throw new NotFoundException('No contract found with this id');
    }

    return contract;
  }
}
