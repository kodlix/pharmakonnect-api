import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { GroupchatService } from './groupchat.service';
import { CreateGroupchatDto } from './dto/create-groupchat.dto';
import { UpdateGroupchatDto } from './dto/update-groupchat.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('groupchat') 
@ApiTags('groupchat')
export class GroupchatController {
  constructor(private readonly groupchatService: GroupchatService) {}

  @Post()
  create(@Body() createGroupchatDto: CreateGroupchatDto) {
    return this.groupchatService.create(createGroupchatDto);
    //sample payload
    // {
    //   "creatorId": "b3fb4244-a23b-472a-b6dc-6d861c8bda9b",
    //   "sectorId": " ",
    //   "name": "TEST Group",
    //   "description": "Testingthe API",
    //   "onlyAdminCanPost": true,
    //   "isActive": true,
    //   "activateOn": "2021-02-26T11:39:48.885Z",
    //   "expiresOn": "2021-03-26T11:39:48.885Z",
    //   "createdBy": "ifeoma Okoro",
    //   "participant": [
    //     {
    //   "accountId": "eebf5e29-c82c-4134-a16a-2896eabe1086",
    //   "canPost": true,
    //   "createdBy":"",
    //   "groupChatID": ""
    
    //     }
    //   ]
    // }
  }

  @Get()
  findAll() {
    return this.groupchatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupchatService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateGroupchatDto: UpdateGroupchatDto) {
    return this.groupchatService.update(id, updateGroupchatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupchatService.remove(id);
  }
}
