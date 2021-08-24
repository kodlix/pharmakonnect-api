import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProfessionService } from './profession.service';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfessionRO } from './interfaces/profession.interface';
import { DeleteResult } from 'typeorm';

@Controller('profession')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiTags('Profession')
export class ProfessionController {
  constructor(private readonly professionService: ProfessionService) {}

  @Post()
  @ApiOperation({ summary: 'Save profession' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  async create(@Body() createProfessionDto: CreateProfessionDto, @Req() req: any ) {
    return await this.professionService.createEntity(createProfessionDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all professions' })
  @ApiResponse({ status: 200, description: 'Return all profession' })
  async findAll(): Promise<ProfessionRO[]> {
    return await this.professionService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get profession  by Id' })
  @ApiResponse({ status: 200, description: 'Return profession' })
  async findOne(@Param('id') id: string): Promise<ProfessionRO> {
    return await this.professionService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update profession  by Id' })
  @ApiResponse({ status: 200, description: 'Return profession successfully updated' })
  async update(@Param('id') id: string, @Body() updateProfessionDto: UpdateProfessionDto, @Req() req: any ): Promise<string> {
    return await this.professionService.updateEntity(id, updateProfessionDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete profession  by Id' })
  @ApiResponse({ status: 200, description: 'Profession successfully deleted' })
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.professionService.delete(id);
  }
}
