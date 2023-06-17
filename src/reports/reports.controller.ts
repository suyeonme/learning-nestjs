import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';

import { AuthGuard, AdminGuard } from '../guards';
import { Serialize } from '../interceptors';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';

import { CreateReportDto, ReportDto, ApproveReportDto } from './dtos';
import { ReportsService } from './reports.service';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(parseInt(id), body.approved);
  }
}
