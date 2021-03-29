import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { EventtypeService } from './eventtype.service';
import { CreateEventtypeDto } from './dto/create-eventtype.dto';
import { UpdateEventtypeDto } from './dto/update-eventtype.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventTypeRO } from './interfaces/eventtype.interface';
import { DeleteResult } from 'typeorm';

@Controller('eventtype')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiTags('eventType')
export class EventtypeController {
  constructor(private readonly eventtypeService: EventtypeService) {}

  @Post()
  @ApiOperation({ summary: 'Save Event Type' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  async create(@Body() createEventtypeDto: CreateEventtypeDto, @Req() req: any ) {
    return await this.eventtypeService.create(createEventtypeDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all event type' })
  @ApiResponse({ status: 200, description: 'Return all event type' })
  async findAll(): Promise<EventTypeRO[]> {
    return await this.eventtypeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event type' })
  @ApiResponse({ status: 200, description: 'Return event type' })
  async findOne(@Param('id') id: string): Promise<EventTypeRO> {
    return await this.eventtypeService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update event type' })
  @ApiResponse({ status: 200, description: 'Return event  type successfully updated' })
  async update(@Param('id') id: string, @Body() updateEventtypeDto: UpdateEventtypeDto, @Req() req: any ): Promise<string> {
    return await this.eventtypeService.update(id, updateEventtypeDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete event type' })
  @ApiResponse({ status: 200, description: 'Event Type successfully deleted' })
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.eventtypeService.remove(id);
  }
}
