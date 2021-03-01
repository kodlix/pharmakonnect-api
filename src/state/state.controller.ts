import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { StateService } from './state.service';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilterDto } from 'src/_common/filter.dto';
import { StateRO } from './state.interface';

@ApiBearerAuth()
@ApiTags('state')
@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) { }

  @Get()
  @ApiResponse({ status: 200, description: 'Return all state' })
  async findAll(@Query() filterDto: FilterDto): Promise<StateRO[]> {
    return await this.stateService.findAll(filterDto);
  }

  @Get(':id')
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 200, description: 'Return state' })
  async findOne(@Param('id') id: string): Promise<StateRO> {
    return await this.stateService.findOne(id);
  }

  @Get('/getbycountry/:countryid')
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 200, description: 'Return state' })
  async findByCountry(@Param('countryid') countryid: string): Promise<StateRO> {
    return await this.stateService.findByCountry(countryid);
  }

  @Post()
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  async create(@Body() toCreate: CreateStateDto): Promise<string> {
    return await this.stateService.create(toCreate);
  }

  @Put(':id')
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 201, description: 'The record has been successfully update' })
  async update(@Param('id') id: string, @Body() toUpdate: UpdateStateDto): Promise<StateRO> {
    return await this.stateService.update(id, toUpdate);
  }

  @Delete(':id')
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 204, description: 'The record has been successfully delete' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.stateService.remove(id);
  }

}
