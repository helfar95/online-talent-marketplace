import { Controller, Param, Post, Request } from '@nestjs/common';
import { JobsService } from '../jobs/jobs.service';

@Controller('balances')
export class BalancesController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('deposit/:userId')
  async payForJob(@Param('userId') userId, @Request() request) {
    await this.jobsService.balanceDeposit(userId, parseInt(request.body.amount));

    return { status: 'deposited' };
  }

}
