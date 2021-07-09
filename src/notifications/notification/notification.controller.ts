import { Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { NotificationRO } from './interface/notification.interface';
import { AuthGuard } from '@nestjs/passport';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { Query } from '@nestjs/common';

@Controller('notification')
@ApiTags('Notification')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({ status: 200, description: 'Return all notifications' })
  async findAll(): Promise<NotificationRO[]> {
    return await this.notificationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification' })
  @ApiResponse({ status: 200, description: 'Return notifications' })
  async findOne(@Param('id') id: string): Promise<NotificationRO> {
    return await this.notificationService.findOne(id);
  }

  @Get('byaccount/:accountId')
  @ApiOperation({ summary: 'Get unseen notifications by account' })
  @ApiResponse({ status: 200, description: 'Return unseen notifications by account' })
  async findByAccountId(@Param('accountId') accountId: string): Promise<NotificationRO[]> {
    return await this.notificationService.findByAccount(accountId);
  }

  @Get('by_account/all')
  @ApiQuery({ name: 'accountId', type: String })
  @ApiQuery({ name: 'search', type: String })
  @ApiQuery({ name: 'page', type:  Number })

  @ApiOperation({ summary: 'Get all seen and unseen notifications by account' })
  @ApiResponse({ status: 200, description: 'Return all seen and unseen notifications by account' })
  async findAllByAccount(@Query() query: any): Promise<NotificationRO[]> {
    return await this.notificationService.findAllByAccount(query);
  }

  @Put(':id')
  @ApiOperation({ summary: 'update a notification' })
  @ApiResponse({ status: 200, description: 'Return notification updated' })
  async UpdateNotification(@Param('id') id: string) {
    return await this.notificationService.update(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification ' })
  @ApiResponse({ status: 200, description: 'Notification successfully deleted' })
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.notificationService.remove(id);
  }

}
