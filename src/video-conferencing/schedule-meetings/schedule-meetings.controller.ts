import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query, Req, Patch } from '@nestjs/common';
import { ScheduleMeetingsService } from './schedule-meetings.service';
import { CreateScheduleMeetingDto } from './dto/create-schedule-meeting.dto';
import { UpdateScheduleMeetingDto } from './dto/update-schedule-meeting.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScheduleMeetingsRO } from './interfaces/schedule-meetings.interface';
import { AuthGuard } from '@nestjs/passport';
import { FilterDto } from 'src/_common/filter.dto';

@Controller('meeting')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiTags('schedule-meeting')
export class ScheduleMeetingsController {
  constructor(private readonly scheduleMeetingsService: ScheduleMeetingsService) {}

  @Post('/schedule-meeting')
  @ApiOperation({ summary: 'Save meeting scheduling' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  async create(@Body() createScheduleMeetingDto: CreateScheduleMeetingDto,  @Req() req: any) : Promise<string> {
    return await this.scheduleMeetingsService.create(createScheduleMeetingDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all meetings' })
  @ApiResponse({ status: 200, description: 'Return all meetings' })
  async findAll(@Query() filterDto: FilterDto) : Promise<ScheduleMeetingsRO[]>{
    return await this.scheduleMeetingsService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a meeting' })
  @ApiResponse({ status: 200, description: 'Return a meeting' })
  async findOne(@Param('id') id: string) : Promise<ScheduleMeetingsRO> {
    return await this.scheduleMeetingsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a meeting' })
  @ApiResponse({ status: 200, description: 'Return meeting successfully updated' })
  async update(@Param('id') id: string, @Body() updateScheduleMeetingDto: UpdateScheduleMeetingDto): Promise<string> {
    return await this.scheduleMeetingsService.update(id, updateScheduleMeetingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a meeting' })
  @ApiResponse({ status: 200, description: 'Meeting successfully deleted' })
  async remove(@Param('id') id: string) {
    return await this.scheduleMeetingsService.remove(id);
  }
}
