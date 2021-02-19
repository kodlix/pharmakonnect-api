/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { JobVacancyService } from './jobvacancy.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateJobVacancyDto } from './dto/create-jobvacancy.dto';
import { UpdateJobVacancyDto } from './dto/update-jobvacancy.dto';
import { ApproveJobVacancyDto } from './dto/approve-jobvacancy';
import { RejectJobVacancyDto } from './dto/reject-jobvacancy';
import { JobVacancyRO } from './jobvacancy.interface';

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
  async findAll() :Promise<JobVacancyRO[]> {
    return await this.jobvacancyService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Get jobvacancy by Id' })
  async findOne(@Param('id') id: string) :Promise<JobVacancyRO> {
    return await this.jobvacancyService.findOne(id);
  }

  @Get(':accountId')
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Get jobvacancy by AccountId' })
  async findByAccountId(@Param('accountId') accountId: string): Promise<JobVacancyRO[]> {
    return await this.jobvacancyService.findByAccountId(accountId);
  }

  @Put(':id')
  @ApiResponse({ status: 201, description: 'Update Successfull.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Update jobvacancy' })

  async update(@Param('id') id: string, @Body() updateJobVacancyDto: UpdateJobVacancyDto): Promise<JobVacancyRO> {
    return await this.jobvacancyService.update(id, updateJobVacancyDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 201, description: 'Delete Successfull.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Delete jobvacancy' })

   async remove(@Param('id') id: string) : Promise<any> {
     if(id === null){
      throw new HttpException({ error: `Job vacancy does not exists` }, HttpStatus.INTERNAL_SERVER_ERROR);

     }
    return await this.jobvacancyService.remove(id);
  }
  @Put('approve/:id')
  @ApiResponse({ status: 201, description: 'Approved.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Approve jobvacancy' })

  async approve(@Param('id') id: string,  @Body() approveJobVacancyDto: ApproveJobVacancyDto) : Promise<JobVacancyRO>{
    return await this.jobvacancyService.updateApprove(id, approveJobVacancyDto)
  }

  @Put('reject/:id')
  @ApiResponse({ status: 201, description: 'Rejected.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Reject jobvacancy' })

  async reject(@Param('id') id: string,  @Body() rejectJobVacancyDto: RejectJobVacancyDto): Promise<JobVacancyRO>{
    return await this.jobvacancyService.updateReject(id, rejectJobVacancyDto)
  }
}
