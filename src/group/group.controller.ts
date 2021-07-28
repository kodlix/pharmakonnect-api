/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, Req, UseGuards, Query, UploadedFile } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UpdateGroupDto } from './dto/update-group.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from 'src/_utility/fileupload.util';
import { diskStorage } from 'multer';
import { UseInterceptors } from '@nestjs/common';
import { CreateGroupContactDto } from './dto/create-group-contact.dto';
import { uploadFile } from 'src/_utility/upload.util';

@Controller('group')
@ApiBearerAuth()
@ApiTags('group')
@UseGuards(AuthGuard())
export class GroupController {
  constructor(private readonly groupService: GroupService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        logo: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string'},
        description: {
          type: 'string'},
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(@Body() dto: CreateGroupDto, @UploadedFile() logo: any, @Req() req: any,): Promise<any[]> {
    const user = req.user;
    if (logo) {
      const imageUrl = await uploadFile(logo.path);
      dto.logo = imageUrl;
    }
    const result = await this.groupService.createGroup(dto, user);
    return result;
  }

  @Post('members')
  @ApiBody({type: CreateGroupContactDto})
  @ApiOperation({ summary: 'Add contact to group' })
  async createMember(@Body() createGroupMemberDto: CreateGroupContactDto, @Req() req: any ): Promise<any>{
    const result = await this.groupService.createGroupContact(createGroupMemberDto, req.user);
    return result;

  }
  
  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        logo: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string'},
        description: {
          type: 'string'},
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async update(@Body() dto: UpdateGroupDto, @Param('id') id: string, @UploadedFile() logo: any, @Req() req: any): Promise<boolean> {
    const user = req.user;
    if (logo) {
      const imageUrl = await uploadFile(logo.path);
      dto.logo = imageUrl;
    }
    return await this.groupService.editGroup(id, dto, user);
  }

  @Get('/all')
  async findAllByAccount(@Query('page') page: number, @Query('take') take: number, @Req() req: any) {
    const { user } = req;
    return await this.groupService.findAllByAccount(page, take, user);
  }

  @Get()
  async findAll(@Query('page') page: number, @Query('take') take: number, @Req() req: any) {
    const { user } = req;
    return await this.groupService.findAll(page, take, user);
  }

  @Get('/groupcontacts/:groupId')
  async findGroupContacts(@Param('groupId') groupId: string, @Query('page') page: number, @Query('take') take: number, @Req() req: any) {
    return await this.groupService.findGroupContacts(groupId, page, take, req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.groupService.getGroupbyId(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const { user } = req;
    return await this.groupService.removebyId(id, user);
  }

  @Delete('groupmember/:id')
  @ApiOperation({ summary: 'Delete contact from group' })
  async removeContact(@Param('id') id:string){
   return await this.groupService.removeGoupMemberId(id)
  }
}
