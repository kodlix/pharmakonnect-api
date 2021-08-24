import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrganizationTypeService } from './organization-type.service';
import { CreateOrganizationTypeDto } from './dto/create-organization-type.dto';
import { UpdateOrganizationTypeDto } from './dto/update-organization-type.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrganizationTypeRO } from './interfaces/organization-type.interface';
import { DeleteResult } from 'typeorm';

@Controller('organization-type')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiTags('Organization Type')
export class OrganizationTypeController {
  constructor(private readonly organizationTypeService: OrganizationTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Save organization type' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  async create(@Body() createOrganizationTypeDto: CreateOrganizationTypeDto, @Req() req: any ) {
    return await this.organizationTypeService.createEntity(createOrganizationTypeDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all organization types' })
  @ApiResponse({ status: 200, description: 'Return all organization types' })
  async findAll(): Promise<OrganizationTypeRO[]> {
    return await this.organizationTypeService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization type  by Id' })
  @ApiResponse({ status: 200, description: 'Return organization type' })
  async findOne(@Param('id') id: string): Promise<OrganizationTypeRO> {
    return await this.organizationTypeService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update organization type  by Id' })
  @ApiResponse({ status: 200, description: 'Return organization type successfully updated' })
  async update(@Param('id') id: string, @Body() updateOrganizationTypeDto: UpdateOrganizationTypeDto, @Req() req: any ): Promise<string> {
    return await this.organizationTypeService.updateEntity(id, updateOrganizationTypeDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete organization type  by Id' })
  @ApiResponse({ status: 200, description: 'Organization type successfully deleted' })
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.organizationTypeService.delete(id);
  }
}
