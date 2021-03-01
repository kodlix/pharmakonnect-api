import { CountryRO } from './country.interface';
import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilterDto } from 'src/_common/filter.dto';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@ApiBearerAuth()
@ApiTags('country')
@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) { }

  @Get()
  @ApiResponse({ status: 200, description: 'Return all country' })
  async findAll(@Query() filterDto: FilterDto): Promise<CountryRO[]> {
    return await this.countryService.findAll(filterDto);
  }

  @Get(':id')
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 200, description: 'Return country' })
  async findOne(@Param('id') id: string): Promise<CountryRO> {
    return await this.countryService.findOne(id);
  }

  @Post()
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  async create(@Body() toCreate: CreateCountryDto): Promise<string> {
    return await this.countryService.create(toCreate);
  }

  @Put(':id')
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 201, description: 'The record has been successfully update' })
  async update(@Param('id') id: string, @Body() toUpdate: UpdateCountryDto): Promise<CountryRO> {
    return await this.countryService.update(id, toUpdate);
  }

  @Delete(':id')
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 204, description: 'The record has been successfully delete' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.countryService.remove(id);
  }

}
