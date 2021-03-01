import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('contact')
@ApiTags('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiBody({type: [CreateContactDto] })
  create(@Body() createContactDto: CreateContactDto[]): Promise<any[]> {
    const result = this.contactService.createContact(createContactDto);
    return result;
  }

  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.getContactbyId(id);
  }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
  //   return this.contactService.update(+id, updateContactDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.removebyId(id);
  }
}
