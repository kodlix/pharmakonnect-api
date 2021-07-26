import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, UseGuards, Req } from '@nestjs/common';
import { ChatConverationService } from './services/chat.conversation.service';
import { AlertGateway } from './chat.chatservice';
import { CreateConversationDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChatGateway } from 'src/gateway/chat.gateway';
//import { ChatGroupChatService } from './services/chat.groupChatService';

@ApiBearerAuth()
@Controller('chat')
@ApiTags('chat')
@UseGuards(AuthGuard())
export class ChatController {
  constructor(private readonly chatService: ChatConverationService, private readonly chatgatway: ChatGateway, private readonly alertgatway: AlertGateway) {}

  @Post('conversation')
  async create(@Body() createChatDto: CreateConversationDto, @Req() req: any) {
    const { user } = req;
    const result =  await this.chatService.create(createChatDto, user); 
    this.chatgatway.sendToUser(result, req.user);
    return result;
  }

  @Post('gateway')
    @HttpCode(200)
    sendAlertToAll(@Body() dto: { message: string }) {
        this.alertgatway.sendToAll(dto.message);
        return dto;
    }

  @Get('conversationparticipant/:channelid')
  findConversation( @Param('channelid') channelid: string,  @Req() req: any) {
    const { user } = req;
    const creatorid = user.id
    return this.chatService.findConversation(creatorid, channelid)
  }

  @Get('conversation/:id')
  findConversationById( @Param('id') id: string,  @Req() req: any) {
    return this.chatService.findConversationById(id, req.user)
  }

  @Get()
  async findOne( @Req() req: any) {
    const { user } = req;
    return await this.chatService.findOne(user.id);
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
