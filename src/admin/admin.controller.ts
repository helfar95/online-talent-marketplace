import { Controller, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('best-profession')
  bestProfession(@Query('start_date') startDate: Date, @Query('end_date') endDate: Date) {
    return this.adminService.getBestProfessions(startDate, endDate);
  }

  @Get('best-clients')
    bestClients(@Query('start_date') startDate: Date, @Query('end_date') endDate: Date, @Query('limit') limit: number){
      return this.adminService.getBestClients(startDate, endDate, limit);
  }
}
