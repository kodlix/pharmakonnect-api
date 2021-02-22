import { PartialType } from '@nestjs/mapped-types';
import { CreateConversationDto } from './create-chat.dto';

export class UpdateChatDto extends PartialType(CreateConversationDto) {}
