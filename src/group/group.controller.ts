import { Controller, Get, Post, Body, Put, Param, Delete, Req, UseGuards, Query, UseInterceptors } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UpdateGroupDto } from './dto/update-group.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from 'src/_utility/fileupload.util';
import { diskStorage } from 'multer';

@Controller('group')
@ApiBearerAuth()
@ApiTags('group')
@UseGuards(AuthGuard())
export class GroupController {
  constructor(private readonly groupService: GroupService) { }

  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @Post()
  async create(@Body() createGroupDto: CreateGroupDto, @Req() req: any): Promise<any[]> {
    const user = req.user;
    const result = await this.groupService.createGroup(createGroupDto, user);
    return result;
  }

  @Put(':id')
  @ApiBody({ type: [UpdateGroupDto] })
  async update(@Body() dto: UpdateGroupDto, @Param('id') id: string, @Req() req: any): Promise<boolean> {
    const user = req.user;
    return await this.groupService.editGroup(id, dto, user);
  }

  @Get('/all')
  async findAllByAccount(@Query('page') page: number, @Query('take') take: number, @Req() req: any) {
    const { user } = req;
    return await this.groupService.findAllByAccount(page, take, user);
  }

  @Get()
  async findAll(@Query('page') page: number, @Query('take') take: number) {
    return await this.groupService.findAll(page, take);
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
}
