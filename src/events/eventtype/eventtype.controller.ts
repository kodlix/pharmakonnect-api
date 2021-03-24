import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { EventtypeService } from './eventtype.service';
import { CreateEventtypeDto } from './dto/create-eventtype.dto';
import { UpdateEventtypeDto } from './dto/update-eventtype.dto';

@Controller('eventtype')
export class EventtypeController {
  constructor(private readonly eventtypeService: EventtypeService) {}

  @Post()
  create(@Body() createEventtypeDto: CreateEventtypeDto) {
    return this.eventtypeService.create(createEventtypeDto);
  }

  @Get()
  findAll() {
    return this.eventtypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventtypeService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateEventtypeDto: UpdateEventtypeDto) {
    return this.eventtypeService.update(+id, updateEventtypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventtypeService.remove(+id);
  }
}
