import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AccountEntity } from 'src/account/entities/account.entity';

@Controller('poll')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiTags('poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Post()
  @ApiOperation({ summary: 'Create poll' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 201, description: 'poll successfully created' })
  create(@Body() createPollDto: CreatePollDto, @Req() req: any) {
    return this.pollService.create(createPollDto, req?.user)
  }

  @Get()
  @ApiOperation({ summary: 'Get all polls' })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  findAll(@Query('page') page?: number, @Query('search') searchParam?: string): Promise<any> {
    return this.pollService.findAll(page, searchParam)
  }

  @Get('owner')
  @ApiOperation({ summary: 'Get all polls by Owner' })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  findAllByOwner(@Req() req: any, @Query('page') page?: number, @Query('search') searchParam?: string): Promise<any> {
    return this.pollService.findAllByOwner(page, searchParam, req?.user)
  }

  @Get(':id')
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Get poll by Id' })
  findOne(@Param('id') id: string): Promise<any> {
    return this.pollService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePollDto: UpdatePollDto, @Req() req: any) {
    return this.pollService.update(id, updatePollDto, req?.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pollService.remove(id);
  }
}
