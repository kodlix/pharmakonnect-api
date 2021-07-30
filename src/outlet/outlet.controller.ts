import { Controller, UseGuards, Post, Body, Req, Get, Query, Param, Put, Delete, HttpStatus, HttpException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { CreateOutletDto } from "./dto/create-outlet.dto";
import { UpdateOutletDto } from "./dto/update-outlet.dto";
import { OutletRO } from "./outlet.interface";
import { OutletService } from "./outlet.service";

@Controller('outlet')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiTags('outlet')
export class OutletController {
    constructor(private readonly outletService: OutletService) { }

    @Post()
    @ApiOperation({ summary: 'Create outlets' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 201, description: 'Jobvacancy successfully created' })
    create(@Body() createOutletDto: CreateOutletDto, @Req() req: any) {
        return this.outletService.create(createOutletDto, req.user);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Outlet' })
    @ApiResponse({ status: 201, description: 'Success.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'search', required: false })
    async findAll(@Req() req: any, @Query('page') page?: number, @Query('search') searchParam?: string): Promise<OutletRO[]> {
        return await this.outletService.findAll(page, searchParam);
    }

    @Get(':id') 
    @ApiResponse({ status: 201, description: 'Success.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiOperation({ summary: 'Get outlet by Id' })
    async findOne(@Param('id') id: string): Promise<OutletRO> {
        return await this.outletService.findOne(id);
    }

    @Get('apps/active')
    @ApiResponse({ status: 201, description: 'Success.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiOperation({ summary: 'Get outlet by AccountId' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'search', required: false })
    async findByAccountId(@Req() req,@Query('page') page: number,@Query('search') searchParam?: string
    ): Promise<OutletRO[]> {
        const { user } = req;

        return await this.outletService.findByAccountId(user.id, page,searchParam);
    }

    @Put(':id')
    @ApiResponse({ status: 201, description: 'Update Successfull.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiOperation({ summary: 'Update outlet' })
    async update(
        @Param('id') id: string,
        @Body() updateOutletDto: UpdateOutletDto,
        @Req() req: any
    ): Promise<OutletRO> {
        return await this.outletService.update(id, updateOutletDto, req.user);
    }

    @Delete(':id')
    @ApiResponse({ status: 201, description: 'Delete Successfull.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiOperation({ summary: 'Delete outlet' })
    async remove(@Param('id') id: string): Promise<any> {
        if (id === null) {
            throw new HttpException(
                { error: `Outlet does not exists` },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
        return await this.outletService.remove(id);
    }
}