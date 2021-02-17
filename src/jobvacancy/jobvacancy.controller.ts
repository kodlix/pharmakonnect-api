/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { JobVacancyService } from './jobvacancy.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateJobVacancyDto } from './dto/create-jobvacancy.dto';
import { UpdateJobVacancyDto } from './dto/update-jobvacancy.dto';
import { ApproveJobVacancyDto } from './dto/approve-jobvacancy';
import { RejectJobVacancyDto } from './dto/reject-jobvacancy';
import { AuthGuard } from '@nestjs/passport';

@Controller('jobvacancy')
//@ApiBearerAuth()
//@UseGuards(AuthGuard())
@ApiTags('jobvacancy')
export class JobVacancyController {
  constructor(private readonly jobvacancyService: JobVacancyService) {}

  @Post()
  @ApiOperation({ summary: 'Create jobvacancy' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 201, description: 'Jobvacancy successfully created' })
  create(@Body() createJobVacancyDto: CreateJobVacancyDto) {
    return this.jobvacancyService.create(createJobVacancyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all jobvacancy' })
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  findAll() {
    return this.jobvacancyService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Get jobvacancy by Id' })
  findOne(@Param('id') id: string) {
    return this.jobvacancyService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({ status: 201, description: 'Update Successfull.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Update jobvacancy' })

  update(@Param('id') id: string, @Body() updateJobVacancyDto: UpdateJobVacancyDto) {
    return this.jobvacancyService.update(id, updateJobVacancyDto);
  }

  @Delete(':id/delete')
  @ApiResponse({ status: 201, description: 'Delete Successfull.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Delete jobvacancy' })

   remove(@Param('id') id: string) : Promise<any> {
     if(id === null){
      throw new HttpException({ error: `Job vacancy does not exists` }, HttpStatus.INTERNAL_SERVER_ERROR);

     }
    return this.jobvacancyService.remove(id);
  }
  @Put(':id/approve')
  @ApiResponse({ status: 201, description: 'Approved.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Approve jobvacancy' })

  approve(@Param('id') id: string,  @Body() approveJobVacancyDto: ApproveJobVacancyDto){
    return this.jobvacancyService.updateApprove(id, approveJobVacancyDto)
  }

  @Put(':id/reject')
  @ApiResponse({ status: 201, description: 'Rejected.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Reject jobvacancy' })

  reject(@Param('id') id: string,  @Body() rejectJobVacancyDto: RejectJobVacancyDto){
    return this.jobvacancyService.updateReject(id, rejectJobVacancyDto)
  }
}
