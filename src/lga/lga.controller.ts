import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { LgaService } from './lga.service';
import { CreateLgaDto } from './dto/create-lga.dto';
import { UpdateLgaDto } from './dto/update-lga.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilterDto } from 'src/_common/filter.dto';
import { LgaRO } from './lga.interface';

@ApiBearerAuth()
@ApiTags('lga')
@Controller('lga')
@UseGuards(AuthGuard())
export class LgaController {
  constructor(private readonly lgaService: LgaService) { }

  @Get()
  @ApiResponse({ status: 200, description: 'Return all lga' })
  async findAll(@Query() filterDto: FilterDto): Promise<LgaRO[]> {
    return await this.lgaService.findAll(filterDto);
  }

  @Get(':id')
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 200, description: 'Return lga' })
  async findOne(@Param('id') id: string): Promise<LgaRO> {
    return await this.lgaService.findOne(id);
  }

  @Get('/getbystate/:stateid')
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 200, description: 'Return state' })
  async findByCountry(@Param('stateid') stateid: string): Promise<LgaRO[]> {
    return await this.lgaService.findByState(stateid);
  }

  @Post()
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  async create(@Body() toCreate: CreateLgaDto): Promise<string> {
    return await this.lgaService.create(toCreate);
  }

  @Put(':id')
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 201, description: 'The record has been successfully update' })
  async update(@Param('id') id: string, @Body() toUpdate: UpdateLgaDto): Promise<LgaRO> {
    return await this.lgaService.update(id, toUpdate);
  }

  @Delete(':id')
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 204, description: 'The record has been successfully delete' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.lgaService.remove(id);
  }

}
