import { Controller, Get, Param, Post, Query, Request } from '@nestjs/common';
import { Job } from './entities/job.entity';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('unpaid')
  async findUnterminatedContracts(@Request() request) {
    let jobs: Job[] = await this.jobsService.findUnpaidJobs(request.profile.id);

    return { jobs };
  }

  @Post(':id/pay')
  async payForJob(@Param('id') jobId, @Request() request) {
    console.log("JOB ID ====================> "+ jobId);
    
    await this.jobsService.payForJob(jobId, request.profile.id);

    return { status: 'paid' };
  }

}
