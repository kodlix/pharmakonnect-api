import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PackageRO } from './interfaces/package.interface';
import { DeleteResult } from 'typeorm';

@Controller('package')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiTags('Package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Post()
  @ApiOperation({ summary: 'Save package' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  async create(@Body() createPackageDto: CreatePackageDto, @Req() req: any ) {
    return await this.packageService.createEntity(createPackageDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all packages' })
  @ApiResponse({ status: 200, description: 'Return all packages' })
  async findAll(): Promise<PackageRO[]> {
    return await this.packageService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get package  by Id' })
  @ApiResponse({ status: 200, description: 'Return package' })
  async findOne(@Param('id') id: string): Promise<PackageRO> {
    return await this.packageService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update package  by Id' })
  @ApiResponse({ status: 200, description: 'Return package successfully updated' })
  async update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto, @Req() req: any ): Promise<string> {
    return await this.packageService.updateEntity(id, updatePackageDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete package  by Id' })
  @ApiResponse({ status: 200, description: 'Package successfully deleted' })
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.packageService.delete(id);
  }
}
