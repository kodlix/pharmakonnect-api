import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AdvertZoneService } from './advert-zone.service';
import { CreateAdvertZoneDto } from './dto/create-advert-zone.dto';
import { UpdateAdvertZoneDto } from './dto/update-advert-zone.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdvertZoneRO } from './interfaces/advert-zone.interface';
import { DeleteResult } from 'typeorm';

@Controller('advert-zone')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiTags('Advert Zone')
export class AdvertZoneController {
  constructor(private readonly advertZoneService: AdvertZoneService) {}

  @Post()
  @ApiOperation({ summary: 'Save advert zone' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  async create(@Body() createAdvertZoneDto: CreateAdvertZoneDto, @Req() req: any ) {
    return await this.advertZoneService.createEntity(createAdvertZoneDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all advert zones' })
  @ApiResponse({ status: 200, description: 'Return all advert zones' })
  async findAll(): Promise<AdvertZoneRO[]> {
    return await this.advertZoneService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get advert zone' })
  @ApiResponse({ status: 200, description: 'Return advert zone' })
  async findOne(@Param('id') id: string): Promise<AdvertZoneRO> {
    return await this.advertZoneService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update advert zone' })
  @ApiResponse({ status: 200, description: 'Return advert zone successfully updated' })
  async update(@Param('id') id: string, @Body() updateAdvertZoneDto: UpdateAdvertZoneDto, @Req() req: any ): Promise<string> {
    return await this.advertZoneService.updateEntity(id, updateAdvertZoneDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete advert zone' })
  @ApiResponse({ status: 200, description: 'Advert zone successfully deleted' })
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.advertZoneService.delete(id);
  }
}
