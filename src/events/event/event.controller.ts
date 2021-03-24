import { Controller, Get, Post, Body, Put, Param, Delete, Req, UseInterceptors, ClassSerializerInterceptor, Query, Patch, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventRO } from './interfaces/event.interface';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilterDto } from 'src/_common/filter.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('event')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiTags('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({ summary: 'Save Event' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  create(@Body() createEventDto: CreateEventDto, @Req() req: any): Promise<string> {
    return this.eventService.create(createEventDto, req.user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: 200, description: 'Return all events' })
  async findAll(@Query() filterDto: FilterDto,  @Req() req: any ) : Promise<EventRO[]>{
    return await this.eventService.findAll(filterDto, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event' })
  @ApiResponse({ status: 200, description: 'Return event' })
  async findOne(@Param('id') id: string) : Promise<EventRO> {
    return await this.eventService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update event' })
  @ApiResponse({ status: 200, description: 'Return event successfully updated' })
  async update(@Param('id') id: string, @Body() request: UpdateEventDto, @Req() req: any): Promise<string> {
    return await this.eventService.update(id, request, req);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Publish event' })
  @ApiResponse({ status: 200, description: 'Return event successfully published' })
  async publishEvent(@Param('id') id: string) : Promise<string> {
    return await this.eventService.publishEvent(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a meeting' })
  @ApiResponse({ status: 200, description: 'Meeting successfully deleted' })
  async remove(@Param('id') id: string) {
    return await this.eventService.remove(id);
  }
}
