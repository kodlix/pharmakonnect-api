import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query, Req, Patch, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ScheduleMeetingsService } from './schedule-meetings.service';
import { CreateScheduleMeetingDto } from './dto/create-schedule-meeting.dto';
import { UpdateScheduleMeetingDto } from './dto/update-schedule-meeting.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScheduleMeetingsRO } from './interfaces/schedule-meetings.interface';
import { AuthGuard } from '@nestjs/passport';
import { FilterDto } from 'src/_common/filter.dto';

@ApiBearerAuth()
@Controller('meeting')
@ApiTags('schedule-meeting')
export class ScheduleMeetingsController {
  constructor(private readonly scheduleMeetingsService: ScheduleMeetingsService) {}

  @UseGuards(AuthGuard())
  @Post('/schedule-meeting')
  @ApiOperation({ summary: 'Save meeting scheduling' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  async create(@Body() createScheduleMeetingDto: CreateScheduleMeetingDto,  @Req() req: any) : Promise<string> {
    return await this.scheduleMeetingsService.create(createScheduleMeetingDto, req.user);
  }

  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOperation({ summary: 'Get all meetings' })
  @ApiResponse({ status: 200, description: 'Return all meetings' })
  async findAll(@Query() filterDto: FilterDto,  @Req() req: any ) : Promise<ScheduleMeetingsRO[]>{
    return await this.scheduleMeetingsService.findAll(filterDto, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a meeting' })
  @ApiResponse({ status: 200, description: 'Return a meeting' })
  async findOne(@Param('id') id: string) : Promise<ScheduleMeetingsRO> {
    return await this.scheduleMeetingsService.findOne(id);
  }

  @UseGuards(AuthGuard())
  @Put(':id')
  @ApiOperation({ summary: 'Update a meeting' })
  @ApiResponse({ status: 200, description: 'Return meeting successfully updated' })
  async update(@Param('id') id: string, @Body() updateScheduleMeetingDto: UpdateScheduleMeetingDto, @Req() req: any): Promise<string> {
    return await this.scheduleMeetingsService.update(id, updateScheduleMeetingDto, req);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a meeting' })
  @ApiResponse({ status: 200, description: 'Meeting successfully deleted' })
  async remove(@Param('id') id: string) {
    return await this.scheduleMeetingsService.remove(id);
  }

  @Get('/token/gettoken')
  @ApiOperation({ summary: 'Get token' })
  @ApiResponse({ status: 200, description: 'Return token' })
  async getToken() : Promise<string>{
    return await this.scheduleMeetingsService.getToken();
  }

}
