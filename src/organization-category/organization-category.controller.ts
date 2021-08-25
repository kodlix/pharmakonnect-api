import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrganizationCategoryService } from './organization-category.service';
import { CreateOrganizationCategoryDto } from './dto/create-organization-category.dto';
import { UpdateOrganizationCategoryDto } from './dto/update-organization-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrganizationCategoryRO } from './interfaces/organization-category.interface';
import { DeleteResult } from 'typeorm';

@Controller('organization-category')
@ApiBearerAuth()
@ApiTags('Organization Category')
export class OrganizationCategoryController {
  constructor(private readonly organizationCategoryService: OrganizationCategoryService) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Save organization category' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  async create(@Body() createOrganizationCategoryDto: CreateOrganizationCategoryDto, @Req() req: any ) {
    return await this.organizationCategoryService.createEntity(createOrganizationCategoryDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all organization categories' })
  @ApiResponse({ status: 200, description: 'Return all organization categories' })
  async findAll(): Promise<OrganizationCategoryRO[]> {
    return await this.organizationCategoryService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization category  by Id' })
  @ApiResponse({ status: 200, description: 'Return organization category' })
  async findOne(@Param('id') id: string): Promise<OrganizationCategoryRO> {
    return await this.organizationCategoryService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Update organization category  by Id' })
  @ApiResponse({ status: 200, description: 'Return organization category successfully updated' })
  async update(@Param('id') id: string, @Body() updateOrganizationCategoryDto: UpdateOrganizationCategoryDto, @Req() req: any ): Promise<string> {
    return await this.organizationCategoryService.updateEntity(id, updateOrganizationCategoryDto, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Delete organization category  by Id' })
  @ApiResponse({ status: 200, description: 'Organization category successfully deleted' })
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.organizationCategoryService.delete(id);
  }
}
