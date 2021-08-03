/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('dashboard')
@ApiBearerAuth()
@ApiTags('dashboard')
@UseGuards(AuthGuard())
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('/ind/stat')
  @ApiOperation({ summary: 'get individual account statistics: contact, group and blogs'})
  async getIndividualStats(@Req() req: any) {
    const { user } = req;
    return await this.dashboardService.getIndividualStats(user);
  }

  @Get('/corp/stat')
  @ApiOperation({description: 'get corporate  account statistics: blogs, events, adverts, staff, polls and outlets'})
  async getCorporateStats(@Req() req: any) {
    const { user } = req;
    return await this.dashboardService.getCorporateStats(user);
  }

  @Get('/admin/stat')
  @ApiOperation({description: 'get admin account statistics: groups, accounts, blogs, events, adverts, staff, polls and outlets'})
  async getAdminStats() {
    return await this.dashboardService.getAdminStats();
  }

  @Get('/admin/events')
  @ApiOperation({description: 'get pending events for admin approval'})
  async getAdminEvents() {
    return await this.dashboardService.getEvents();
  }

  @Get('/admin/blogs')
  @ApiOperation({description: 'get pending Blogs for admin approval'})
  async getAdminBlogs() {
    return await this.dashboardService.getBlogs();
  }

  @Get('/admin/adverts')
  @ApiOperation({description: 'get pending adverts for admin approval'})
  async getAdminAdverts() {
    return await this.dashboardService.getAdverts();
  }

  @Get('/admin/jobs')
  @ApiOperation({description: 'get pending jobs for admin approval'})
  async getAdminJobs() {
    return await this.dashboardService.getJobs();
  }

  @Get('/user/events')
  @ApiOperation({description: 'get upcomming events a  user registered for'})
  async getUserEvents(@Req() req: any) {
    return await this.dashboardService.getFutureEventsByUser(req.user);
  }

  @Get('/blogs/latest')
  @ApiOperation({description: 'get latest published blogs'})
  async getLatestBlogs() {
    return await this.dashboardService.getLatestBlogs();
  }

  @Get('/jobs/latest')
  @ApiOperation({description: 'get current jobs'})
  async getLatestJobs() {
    return await this.dashboardService.getCurrentJobs();
  }

  @Get('/staff/unverified')
  @ApiOperation({description: 'get current jobs'})
  async getUnverifiedStaff(@Req() req: any) {
    return await this.dashboardService.getUnverifiedStaff(req.user);
  }
}
