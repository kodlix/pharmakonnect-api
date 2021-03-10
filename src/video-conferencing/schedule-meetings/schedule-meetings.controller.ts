import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
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
  async create(@Body() createScheduleMeetingDto: CreateScheduleMeetingDto) : Promise<ScheduleMeetingsRO> {
    return await this.scheduleMeetingsService.create(createScheduleMeetingDto);
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
  async update(@Param('id') id: string, @Body() updateScheduleMeetingDto: UpdateScheduleMeetingDto) {
    return await this.scheduleMeetingsService.update(id, updateScheduleMeetingDto);
  }

  
  @Put('start-meeting/:id')
  @ApiOperation({ summary: 'Start a meeting' })
  @ApiResponse({ status: 200, description: 'Return meeting successfully started' })
  async startMeeting(@Param('id') id: string) {
    return await this.scheduleMeetingsService.startMeeting(id);
  }

  @Put('end-meeting/:id')
  @ApiOperation({ summary: 'End a meeting' })
  @ApiResponse({ status: 200, description: 'Return meeting successfully ended' })
  async endMeeting(@Param('id') id: string) {
    return await this.scheduleMeetingsService.endMeeting(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a meeting' })
  @ApiResponse({ status: 200, description: 'Meeting successfully deleted' })
  async remove(@Param('id') id: string) {
    return await this.scheduleMeetingsService.remove(id);
  }
}
