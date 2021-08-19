import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TypeOfPracticeService } from './type-of-practice.service';
import { CreateTypeOfPracticeDto } from './dto/create-type-of-practice.dto';
import { UpdateTypeOfPracticeDto } from './dto/update-type-of-practice.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TypeOfPracticeRO } from './interfaces/type-of-practice.interface';
import { DeleteResult } from 'typeorm';

@Controller('type-of-practice')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiTags('Type of Practice')
export class TypeOfPracticeController {
  constructor(private readonly typeOfPracticeService: TypeOfPracticeService) {}

  @Post()
  @ApiOperation({ summary: 'Save type of practice' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  async create(@Body() createTypeOfPracticeDto: CreateTypeOfPracticeDto, @Req() req: any ) {
    return await this.typeOfPracticeService.createEntity(createTypeOfPracticeDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all type of practices' })
  @ApiResponse({ status: 200, description: 'Return all type of practices' })
  async findAll(): Promise<TypeOfPracticeRO[]> {
    return await this.typeOfPracticeService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get type of practice' })
  @ApiResponse({ status: 200, description: 'Return type of practice' })
  async findOne(@Param('id') id: string): Promise<TypeOfPracticeRO> {
    return await this.typeOfPracticeService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update type of practice' })
  @ApiResponse({ status: 200, description: 'Return type of practice successfully updated' })
  async update(@Param('id') id: string, @Body() updateTypeOfPracticeDto: UpdateTypeOfPracticeDto, @Req() req: any ): Promise<string> {
    return await this.typeOfPracticeService.updateEntity(id, updateTypeOfPracticeDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete type of practice' })
  @ApiResponse({ status: 200, description: 'Type of practice successfully deleted' })
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.typeOfPracticeService.delete(id);
  }
}
