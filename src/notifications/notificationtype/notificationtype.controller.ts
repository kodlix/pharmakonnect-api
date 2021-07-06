import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { CreateNotificationtypeDto } from './dto/create-notificationtype.dto';
import { UpdateNotificationtypeDto } from './dto/update-notificationtype.dto';
import { NotificationTypeRO } from './interfaces/notificationtype.interface';
import { NotificationtypeService } from './notificationtype.service';


@Controller('notificationType')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiTags('notificationType')
export class NotificationtypeController {
  constructor(private readonly notificationtypeService: NotificationtypeService) {}

  @Post()
  @ApiOperation({ summary: 'Save Notification Type' })
  @ApiResponse({ status: 400, description: 'Bad request'})
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  async create(@Body() payload: CreateNotificationtypeDto,  @Req() req: any  ) {
    return await this.notificationtypeService.create(payload, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notification type' })
  @ApiResponse({ status: 200, description: 'Return all notification type' })
  async findAll(): Promise<NotificationTypeRO[]> {
    return await this.notificationtypeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification type' })
  @ApiResponse({ status: 200, description: 'Return notification type' })
  async findOne(@Param('id') id: string): Promise<NotificationTypeRO> {
    return await this.notificationtypeService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update notification type' })
  @ApiResponse({ status: 200, description: 'Return notification type successfully updated' })
  async update(@Param('id') id: string, @Body() payload: UpdateNotificationtypeDto, @Req() req: any ): Promise<string> {
    return await this.notificationtypeService.update(id, payload, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification type' })
  @ApiResponse({ status: 200, description: 'Notification Type successfully deleted' })
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.notificationtypeService.remove(id);
  }
}
