/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { JobVacancyService } from './jobvacancy.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateJobVacancyDto } from './dto/create-jobvacancy.dto';
import { UpdateJobVacancyDto } from './dto/update-jobvacancy.dto';
import { ApproveJobVacancyDto } from './dto/approve-jobvacancy';
import { RejectJobVacancyDto } from './dto/reject-jobvacancy';

@Controller('jobvacancy')
@ApiBearerAuth()
@ApiTags('jobvacancy')
export class JobVacancyController {
  constructor(private readonly jobvacancyService: JobVacancyService) {}

  @Post()
  @ApiOperation({ summary: 'Create jobvacancy' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createJobVacancyDto: CreateJobVacancyDto) {
    return this.jobvacancyService.create(createJobVacancyDto);
  }

  @Get()
  findAll() {
    return this.jobvacancyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobvacancyService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateJobVacancyDto: UpdateJobVacancyDto) {
    return this.jobvacancyService.update(id, updateJobVacancyDto);
  }

  @Delete(':id/delete')
   remove(@Param('id') id: string) : Promise<any> {
     if(id === null){
      throw new HttpException({ error: `Job vacancy does not exists` }, HttpStatus.INTERNAL_SERVER_ERROR);

     }
    return this.jobvacancyService.remove(id);
  }
  @Put(':id/approve')
  approve(@Param('id') id: string,  @Body() approveJobVacancyDto: ApproveJobVacancyDto){
    return this.jobvacancyService.updateApprove(id, approveJobVacancyDto)
  }

  @Put(':id/reject')
  reject(@Param('id') id: string,  @Body() rejectJobVacancyDto: RejectJobVacancyDto){
    return this.jobvacancyService.updateReject(id, rejectJobVacancyDto)
  }
}
