import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ScheduleMeetingsService } from './schedule-meetings.service';
import { CreateScheduleMeetingDto } from './dto/create-schedule-meeting.dto';
import { UpdateScheduleMeetingDto } from './dto/update-schedule-meeting.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ScheduleMeetingsRO } from './interfaces/schedule-meetings.interface';
import { AuthGuard } from '@nestjs/passport';
import { FilterDto } from 'src/_common/filter.dto';

@Controller('meeting')
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Get all meetings' })
  @ApiResponse({ status: 200, description: 'Return all meetings' })
  async findAll(@Query() filterDto: FilterDto) : Promise<ScheduleMeetingsRO[]>{
    return await this.scheduleMeetingsService.findAll(filterDto);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Get a meeting' })
  @ApiResponse({ status: 200, description: 'Return a meeting' })
  async findOne(@Param('id') id: string) : Promise<ScheduleMeetingsRO> {
    return await this.scheduleMeetingsService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Update a meeting' })
  @ApiResponse({ status: 200, description: 'Return meeting successfully updated' })
  async update(@Param('id') id: string, @Body() updateScheduleMeetingDto: UpdateScheduleMeetingDto) {
    return await this.scheduleMeetingsService.update(id, updateScheduleMeetingDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.scheduleMeetingsService.remove(id);
  }
}
