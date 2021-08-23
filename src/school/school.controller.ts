import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SchoolRO } from './interfaces/school.interface';
import { DeleteResult } from 'typeorm';

@Controller('school')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiTags('School')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  @ApiOperation({ summary: 'Save school' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  async create(@Body() createSchoolDto: CreateSchoolDto, @Req() req: any ) {
    return await this.schoolService.createEntity(createSchoolDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all schools' })
  @ApiResponse({ status: 200, description: 'Return all schools' })
  async findAll(): Promise<SchoolRO[]> {
    return await this.schoolService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get school' })
  @ApiResponse({ status: 200, description: 'Return school' })
  async findOne(@Param('id') id: string): Promise<SchoolRO> {
    return await this.schoolService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update school' })
  @ApiResponse({ status: 200, description: 'Return school successfully updated' })
  async update(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto, @Req() req: any ): Promise<string> {
    return await this.schoolService.updateEntity(id, updateSchoolDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete school' })
  @ApiResponse({ status: 200, description: 'School successfully deleted' })
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.schoolService.delete(id);
  }
}
