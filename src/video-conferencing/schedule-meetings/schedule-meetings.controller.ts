import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ScheduleMeetingsService } from './schedule-meetings.service';
import { CreateScheduleMeetingDto } from './dto/create-schedule-meeting.dto';
import { UpdateScheduleMeetingDto } from './dto/update-schedule-meeting.dto';
import { ApiResponse } from '@nestjs/swagger';
import { ScheduleMeetingsRO } from './interfaces/schedule-meetings.interface';

@Controller('meeting')
export class ScheduleMeetingsController {
  constructor(private readonly scheduleMeetingsService: ScheduleMeetingsService) {}

  @Post('/schedule-meeting')
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  async create(@Body() createScheduleMeetingDto: CreateScheduleMeetingDto) : Promise<ScheduleMeetingsRO> {
    return await this.scheduleMeetingsService.create(createScheduleMeetingDto);
  }

  @Get()
  findAll() {
    return this.scheduleMeetingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleMeetingsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateScheduleMeetingDto: UpdateScheduleMeetingDto) {
    return this.scheduleMeetingsService.update(+id, updateScheduleMeetingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleMeetingsService.remove(+id);
  }
}
