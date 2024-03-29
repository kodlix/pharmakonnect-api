import { Controller, Get, Post, Body, Put, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('contact')
@ApiBearerAuth()
@ApiTags('contact')
@UseGuards(AuthGuard())
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiBody({type: [CreateContactDto] })
  create(@Body() createContactDto: CreateContactDto[], @Req() req: any): Promise<any[]> {
    const user = req.user;
    const result = this.contactService.createContact(createContactDto, user);
    return result;
  }

  @Get()
  async findAll( @Req() req: any) {
    const { user } = req;
    return await this.contactService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.getContactbyId(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.removebyId(id);
  }
}
