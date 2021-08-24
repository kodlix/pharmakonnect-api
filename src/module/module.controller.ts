import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ModuleRO } from './interfaces/module.interface';
import { DeleteResult } from 'typeorm';

@Controller('module')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiTags('Application Module')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @ApiOperation({ summary: 'Save Module' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  async create(@Body() createModuleDto: CreateModuleDto, @Req() req: any ) {
    return await this.moduleService.create(createModuleDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Modules' })
  @ApiResponse({ status: 200, description: 'Return all Module' })
  async findAll(): Promise<ModuleRO[]> {
    return await this.moduleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Module  by Id' })
  @ApiResponse({ status: 200, description: 'Return Module' })
  async findOne(@Param('id') id: string): Promise<ModuleRO> {
    return await this.moduleService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Module  by Id' })
  @ApiResponse({ status: 200, description: 'Return Module successfully updated' })
  async update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto, @Req() req: any ): Promise<string> {
    return await this.moduleService.update(id, updateModuleDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Module  by Id' })
  @ApiResponse({ status: 200, description: 'Module successfully deleted' })
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.moduleService.remove(id);
  }
}
