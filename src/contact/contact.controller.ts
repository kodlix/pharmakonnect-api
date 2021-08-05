import { Controller, Get, Post, Body, Put, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('contact')
@ApiBearerAuth()
@ApiTags('contact')
@UseGuards(AuthGuard())
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  @Post()
  @ApiBody({ type: [CreateContactDto] })
  create(@Body() createContactDto: CreateContactDto[], @Req() req: any): Promise<any[]> {
    const user = req.user;
    const result = this.contactService.createContact(createContactDto, user);
    return result;
  }

  @Get()
  async findAll(@Query('page') page: number, @Query('take') take: number, @Query('from') from: string, @Req() req: any) {
    const { user } = req;
    return await this.contactService.findAll(page, take, user, from);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.getContactbyId(id);
  }

  @Get('byaccount/:id')
  findOneByAccount(@Param('id') id: string) {
    return this.contactService.getContactbyAccountId(id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.removebyId(id);
  }

  @Get('all/search')
  async loadChatContact(@Query('searchParam') searchParam: string, @Req() req: any) {
    const { user } = req;
    return await this.contactService.loadChatContact(searchParam , user);
  }

  @Post('/addToContacts/:id')
  addToContacts(@Param('id') id: string, @Req() req: any): Promise<any[]> {
    const user = req.user;
    const result = this.contactService.addToContacts(id, user);
    return result;
  }

}
