import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationRO } from './interface/notification.interface';
import { AuthGuard } from '@nestjs/passport';

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
  @ApiOperation({ summary: 'Get notifications by account' })
  @ApiResponse({ status: 200, description: 'Return notifications by account' })
  async findByAccountId(@Param('accountId') accountId: string): Promise<NotificationRO[]> {
    return await this.notificationService.findByAccount(accountId);
  }

}
