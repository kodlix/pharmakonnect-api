import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MembershipInterestGroupService } from './membership-interest-group.service';
import { CreateMembershipInterestGroupDto } from './dto/create-membership-interest-group.dto';
import { UpdateMembershipInterestGroupDto } from './dto/update-membership-interest-group.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MembershipInterestGroupRO } from './interfaces/membership-interest-group.interface';
import { DeleteResult } from 'typeorm';

@Controller('membership-interest-group')
@ApiBearerAuth()
@ApiTags('Membership Interest Group')
export class MembershipInterestGroupController {
  constructor(private readonly membershipInterestGroupService: MembershipInterestGroupService) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Save membership interest group' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  async create(@Body() createMembershipInterestGroupDto: CreateMembershipInterestGroupDto, @Req() req: any ) {
    return await this.membershipInterestGroupService.createEntity(createMembershipInterestGroupDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all membership interest groups' })
  @ApiResponse({ status: 200, description: 'Return all membership interest groups' })
  async findAll(): Promise<MembershipInterestGroupRO[]> {
    return await this.membershipInterestGroupService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get membership interest group  by Id' })
  @ApiResponse({ status: 200, description: 'Return membership interest group' })
  async findOne(@Param('id') id: string): Promise<MembershipInterestGroupRO> {
    return await this.membershipInterestGroupService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Update membership interest group  by Id' })
  @ApiResponse({ status: 200, description: 'Return membership interest group successfully updated' })
  async update(@Param('id') id: string, @Body() updateMembershipInterestGroupDto: UpdateMembershipInterestGroupDto, @Req() req: any ): Promise<string> {
    return await this.membershipInterestGroupService.updateEntity(id, updateMembershipInterestGroupDto, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Delete membership interest group  by Id' })
  @ApiResponse({ status: 200, description: 'Membership interest group successfully deleted' })
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.membershipInterestGroupService.delete(id);
  }
}
