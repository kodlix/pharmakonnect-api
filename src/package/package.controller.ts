/* eslint-disable prettier/prettier */
import { Controller, Req, UseGuards } from "@nestjs/common";
import { Post, Body, Get, HttpStatus, HttpException, Param, Delete } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreatePackageFeaturesDto } from "./dto/createpackage-feature.dto";
import { PackageRO } from "./package.interface";
import { PackageService } from "./package.service";


@Controller('package')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiTags('package')
export class PackageController {
    constructor(private readonly packageService: PackageService) { }
    @Post()
    @ApiOperation({ summary: 'Create Packages' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 201, description: 'Package successfully created' })
    create(@Body() createPackageFeatureDto: CreatePackageFeaturesDto, @Req() req: any ) {
        return this.packageService.createEntity(createPackageFeatureDto,req.user);
    }

    @Get()
    @ApiOperation({ summary: 'Get Packages' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 201, description: 'Success' })
    async findAll(): Promise<PackageRO[]> {
        return await this.packageService.findAll();
    }

    @Delete(':id')
    @ApiResponse({ status: 201, description: 'Delete Successfull.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiOperation({ summary: 'Delete Package' })
    async deleteEntity(@Param('id') id: string): Promise<any> {
        if (id === null) {
            throw new HttpException(
                { error: `Package does not exists` },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
        return await this.packageService.deleteEntity(id);
    }

}