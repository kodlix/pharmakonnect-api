import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AccountEntity } from 'src/account/entities/account.entity';
import { CreatePollVoteDto } from './dto/create-poll-vote.dto';

@Controller('poll')
@ApiBearerAuth()
@ApiTags('poll')
export class PollController {
  constructor(
    private readonly pollService: PollService) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Create poll' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 201, description: 'poll successfully created' })
  create(@Body() createPollDto: CreatePollDto, @Req() req: any) {
    return this.pollService.create(createPollDto, req?.user)
  }

  @Post('vote')
  @ApiOperation({ summary: 'Vote for a poll' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 201, description: 'voted successfully for this poll' })
  vote(@Body() dto: CreatePollVoteDto, @Req() req: any) {
    return this.pollService.vote(dto, req?.user)
  }

  @Get()
  @UseGuards(AuthGuard())
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
  @UseGuards(AuthGuard())
  findAllByOwner(@Req() req: any, @Query('page') page?: number, @Query('search') searchParam?: string): Promise<any> {
    return this.pollService.findAllByOwner(page, searchParam, req?.user)
  }

  @Get('setting')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Get all poll setting' })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  getPollSetting(): Promise<any> {
    return this.pollService.getPollSettings();
  }

  @Get(':id')
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Get poll by Id' })
  findOne(@Param('id') id: string): Promise<any> {
    return this.pollService.findOne(id);
  }

  @Get('/summary/:id')
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Get poll summary by Id' })
  getPollSummary(@Param('id') id: string): Promise<any> {
    return this.pollService.getPollSummary(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  update(@Param('id') id: string, @Body() updatePollDto: UpdatePollDto, @Req() req: any) {
    return this.pollService.update(id, updatePollDto, req?.user);
  }

  @Put(':id/publish')
  @UseGuards(AuthGuard())
  publish(@Param('id') id: string, @Req() req: any) {
    return this.pollService.publish(id, req?.user);
  }

  // @Put(':id/deactivate')
  // @UseGuards(AuthGuard())
  // deactivate(@Param('id') id: string, @Req() req: any) {
  //   return this.pollService.deactivate(id, req?.user);
  // }

  @Delete(':id')
  @UseGuards(AuthGuard())
  remove(@Param('id') id: string) {
    return this.pollService.remove(id);
  }
  
}
