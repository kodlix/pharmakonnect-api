import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ResourceTypeService } from './resource-type.service';
import { CreateResourceTypeDto } from './dto/create-resource-type.dto';
import { UpdateResourceTypeDto } from './dto/update-resource-type.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResourceTypeRO } from './interfaces/resource-type.interface';
import { DeleteResult } from 'typeorm';

@Controller('resource-type')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiTags('Resource Type')
export class ResourceTypeController {
  constructor(private readonly resourceTypeService: ResourceTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Save resource type' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  async create(@Body() createResourceTypeDto: CreateResourceTypeDto, @Req() req: any ) {
    return await this.resourceTypeService.create(createResourceTypeDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all resource types' })
  @ApiResponse({ status: 200, description: 'Return all resource types' })
  async findAll(): Promise<ResourceTypeRO[]> {
    return await this.resourceTypeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resource type' })
  @ApiResponse({ status: 200, description: 'Return resource type' })
  async findOne(@Param('id') id: string): Promise<ResourceTypeRO> {
    return await this.resourceTypeService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update resource type' })
  @ApiResponse({ status: 200, description: 'Return resource type successfully updated' })
  async update(@Param('id') id: string, @Body() updateResourceTypeDto: UpdateResourceTypeDto, @Req() req: any ): Promise<string> {
    return await this.resourceTypeService.update(id, updateResourceTypeDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete resource type' })
  @ApiResponse({ status: 200, description: 'Resource type successfully deleted' })
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.resourceTypeService.remove(id);
  }
}
