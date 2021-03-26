import { Controller, Get, Post, Body, Put, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { EventusersService } from './eventusers.service';
import { UpdateEventUserRegistrationDto } from './dto/update-eventuser.dto';
import { FilterDto } from 'src/_common/filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventUsersRO } from './interfaces/eventusers.interface';

@Controller('eventusers')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiTags('eventusers')
export class EventusersController {
  constructor(private readonly eventusersService: EventusersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all event users' })
  @ApiResponse({ status: 200, description: 'Return all event users' })
  async findAll(@Query() filterDto: FilterDto) {
    return await this.eventusersService.findAll(filterDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get all me event users' })
  @ApiResponse({ status: 200, description: 'Return me from event users' })
  async findMeFromEventUsers(@Query() filterDto: FilterDto,  @Req() req: any) {
    return await this.eventusersService.findMeFromEventUsers(filterDto, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event users' })
  @ApiResponse({ status: 200, description: 'Return event users' })
  async findOne(@Param('id') id: string): Promise<EventUsersRO> {
    return await this.eventusersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update event users' })
  @ApiResponse({ status: 200, description: 'Return event users successfully updated' })
  async update(@Param('id') id: string, @Body() updateEventuserDto: UpdateEventUserRegistrationDto, @Req() req: any) {
    return await this.eventusersService.update(id, updateEventuserDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete event users' })
  @ApiResponse({ status: 200, description: 'Event users successfully deleted' })
  async remove(@Param('id') id: string) {
    return await this.eventusersService.remove(id);
  }
}
