import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { EventusersService } from './eventusers.service';
import { CreateEventuserDto } from './dto/create-eventuser.dto';
import { UpdateEventuserDto } from './dto/update-eventuser.dto';

@Controller('eventusers')
export class EventusersController {
  constructor(private readonly eventusersService: EventusersService) {}

  @Post()
  create(@Body() createEventuserDto: CreateEventuserDto) {
    return this.eventusersService.create(createEventuserDto);
  }

  @Get()
  findAll() {
    return this.eventusersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventusersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateEventuserDto: UpdateEventuserDto) {
    return this.eventusersService.update(+id, updateEventuserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventusersService.remove(+id);
  }
}
