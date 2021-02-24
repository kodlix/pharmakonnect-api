import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { SectorService } from './sector.service';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('sector')
// @ApiBearerAuth()
@ApiTags('sector')
export class SectorController {
  constructor(private readonly sectorService: SectorService) {}

  @Post()
  @ApiOperation({ summary: 'Create sector' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createSectorDto: CreateSectorDto) {
    return this.sectorService.create(createSectorDto);
  }

  @Get()
  findAll() {
    return this.sectorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectorService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSectorDto: UpdateSectorDto) {
    return this.sectorService.update(id, updateSectorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectorService.remove(id);
  }
}
