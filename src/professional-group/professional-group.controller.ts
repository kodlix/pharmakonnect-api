import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProfessionalGroupService } from './professional-group.service';
import { CreateProfessionalGroupDto } from './dto/create-professional-group.dto';
import { UpdateProfessionalGroupDto } from './dto/update-professional-group.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfessionalGroupRO } from './interfaces/professional-group.interface';
import { DeleteResult } from 'typeorm';

@Controller('professional-group')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiTags('Professional Group')
export class ProfessionalGroupController {
  constructor(private readonly professionalGroupService: ProfessionalGroupService) {}

  @Post()
  @ApiOperation({ summary: 'Save professional group' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  async create(@Body() createProfessionalGroupDto: CreateProfessionalGroupDto, @Req() req: any ) {
    return await this.professionalGroupService.createEntity(createProfessionalGroupDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all professional groups' })
  @ApiResponse({ status: 200, description: 'Return all professional groups' })
  async findAll(): Promise<ProfessionalGroupRO[]> {
    return await this.professionalGroupService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get professional group  by Id' })
  @ApiResponse({ status: 200, description: 'Return professional group' })
  async findOne(@Param('id') id: string): Promise<ProfessionalGroupRO> {
    return await this.professionalGroupService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update professional group  by Id' })
  @ApiResponse({ status: 200, description: 'Return professional group successfully updated' })
  async update(@Param('id') id: string, @Body() updateProfessionalGroupDto: UpdateProfessionalGroupDto, @Req() req: any ): Promise<string> {
    return await this.professionalGroupService.updateEntity(id, updateProfessionalGroupDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete professional group  by Id' })
  @ApiResponse({ status: 200, description: 'Professional group successfully deleted' })
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.professionalGroupService.delete(id);
  }
}
