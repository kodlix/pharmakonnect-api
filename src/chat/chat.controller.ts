import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode } from '@nestjs/common';
import { ChatConverationService } from './services/chat.conversation.service';
import { AlertGateway } from './chat.chatservice';
import { CreateConversationDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
//import { ChatGroupChatService } from './services/chat.groupChatService';

@Controller('chat')
@ApiTags('chat')
export class ChatController {
  constructor(private readonly chatService: ChatConverationService, private readonly alertgatway: AlertGateway) {}

  @Post('conversation')
  create(@Body() createChatDto: CreateConversationDto) {
    return this.chatService.create(createChatDto); 
  }

  @Post('gateway')
    @HttpCode(200)
    sendAlertToAll(@Body() dto: { message: string }) {
        this.alertgatway.sendToAll(dto.message);
        return dto;
    }

  // @Get()
  // findAll() {
  //   return this.chatService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(id);
  }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
  //   return this.chatService.update(+id, updateChatDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(id);
  }
}
