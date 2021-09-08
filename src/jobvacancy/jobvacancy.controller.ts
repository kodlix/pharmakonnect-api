import { AccountEntity } from 'src/account/entities/account.entity';
/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { JobVacancyService } from './jobvacancy.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateJobVacancyDto } from './dto/create-jobvacancy.dto';
import { UpdateJobVacancyDto } from './dto/update-jobvacancy.dto';
import { ApproveJobVacancyDto } from './dto/approve-jobvacancy';
import { RejectJobVacancyDto } from './dto/reject-jobvacancy';
import { JobVacancyRO } from './jobvacancy.interface';
import { AuthGuard } from '@nestjs/passport';
import { FilterDto } from 'src/_common/filter.dto';

@Controller('jobvacancy')
@ApiBearerAuth()
@ApiTags('jobvacancy')
export class JobVacancyController {
  constructor(private readonly jobvacancyService: JobVacancyService) { }

  @Post()
  @ApiOperation({ summary: 'Create jobvacancy' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 201, description: 'Jobvacancy successfully created' })
  @UseGuards(AuthGuard())
  create(@Body() createJobVacancyDto: CreateJobVacancyDto, @Req() req: any) {
    return this.jobvacancyService.create(createJobVacancyDto, req.user);
  }

  // @Get()
  // @ApiOperation({ summary: 'Get jobvacancy' })
  // @ApiResponse({ status: 201, description: 'Success.' })
  // @ApiResponse({ status: 404, description: 'Not Found.' })
  // async findAll(@Query('page') page: number, @Req() req: any): Promise<JobVacancyRO[]> {
  //   console.log(req.user);
  //   return await this.jobvacancyService.findAll(page);
  // }

  @Get('publicjobs')
    @ApiOperation({ summary: 'Get all JobVacancy' })
    @ApiResponse({ status: 201, description: 'Success.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiQuery({ name: 'page', required: false})
    @ApiQuery({ name: 'search', required: false})
    async findJob(@Req() req: any, @Query('search') search: string, @Query('page') page: number): Promise<JobVacancyRO[]> {
        return await this.jobvacancyService.findJob(search, page);
  }

  @Get('/job')
  @ApiOperation({ summary: 'Get all JobVacancy' })
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiQuery({ name: 'page', required: false})
  @ApiQuery({ name: 'search', required: false})
  async findAllJob(@Req() req: any, @Query('search') search: string, @Query('page') page: number): Promise<JobVacancyRO[]> {
      return await this.jobvacancyService.findAllJob(search, page);
}

  @Get(':id')
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Get jobvacancy by Id' })
  async findOne(@Param('id') id: string): Promise<JobVacancyRO> {
    return await this.jobvacancyService.findOne(id);
  }

  @Get('applications/active')
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Get jobvacancy by AccountId' })
  @UseGuards(AuthGuard())
  async findByAccountId(@Query('page') page: number, @Req() req
  ): Promise<JobVacancyRO[]> {
    const { user } = req;

    return await this.jobvacancyService.findByAccountId(user.id,page);
  }

  @Put(':id')
  @ApiResponse({ status: 201, description: 'Update Successfull.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Update jobvacancy' })
  @UseGuards(AuthGuard())
  async update(
    @Param('id') id: string,
    @Body() updateJobVacancyDto: UpdateJobVacancyDto,
    @Req() req: any
  ): Promise<JobVacancyRO> {
    return await this.jobvacancyService.update(id, updateJobVacancyDto,req.user);
  }

  @Delete(':id')
  @ApiResponse({ status: 201, description: 'Delete Successfull.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Delete jobvacancy' })
  @UseGuards(AuthGuard())
  async remove(@Param('id') id: string): Promise<any> {
    if (id === null) {
      throw new HttpException(
        { error: `Job vacancy does not exists` },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return await this.jobvacancyService.remove(id);
  }
  @Put('approve/:id')
  @ApiResponse({ status: 201, description: 'Approved.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Approve jobvacancy' })
  @UseGuards(AuthGuard())
  async approve(
    @Param('id') id: string,
    @Body() approveJobVacancyDto: ApproveJobVacancyDto,
  ): Promise<JobVacancyRO> {
    return await this.jobvacancyService.updateApprove(id, approveJobVacancyDto);
  }

  @Put('reject/:id')
  @ApiResponse({ status: 201, description: 'Rejected.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Reject jobvacancy' })
  @UseGuards(AuthGuard())
  async reject(
    @Param('id') id: string,
    @Body() rejectJobVacancyDto: RejectJobVacancyDto,
  ): Promise<JobVacancyRO> {
    return await this.jobvacancyService.updateReject(id, rejectJobVacancyDto);
  }
}
