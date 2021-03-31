/* eslint-disable prettier/prettier */
import { Post, Body, Get, Delete, Param, HttpException, HttpStatus, Put, Controller, UseGuards, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateFeatureDto } from "./dto/createfeature.dto";
import { UpdateFeatureDto } from "./dto/update-feature.dto";
import { FeatureRO } from "./feature.interface";
import { FeatureService } from "./feature.service";


@Controller('feature')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiTags('feature')
export class FeatureController {
    constructor(private readonly featureService: FeatureService) { }
    @Post()
    @ApiOperation({ summary: 'Create Features' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 201, description: 'Feature successfully created' })
    create(@Body() createFeatureDto: CreateFeatureDto, @Req() req:any) {
        return this.featureService.create(createFeatureDto, req.user);
    }

    @Put(':id')
    @ApiResponse({ status: 201, description: 'Update Successfull.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiOperation({ summary: 'Update Feature' })
    async update(
        @Param('id') id: string,
        @Body() updateFeatureDto: UpdateFeatureDto,
    ): Promise<FeatureRO> {
        return await this.featureService.update(id, updateFeatureDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get Features' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 201, description: 'Success' })
    async findAll(): Promise<FeatureRO[]> {
        return await this.featureService.findAll();
    }

    @Delete(':id')
    @ApiResponse({ status: 201, description: 'Delete Successfull.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiOperation({ summary: 'Delete Feature' })
    async remove(@Param('id') id: string): Promise<any> {
        if (id === null) {
            throw new HttpException(
                { error: `Feature does not exists` },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
        return await this.featureService.remove(id);
    }

}