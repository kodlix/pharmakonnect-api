import { Post, Put, Get, Delete, Param, HttpException, HttpStatus, Controller, UseGuards, Body } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AdvertCategoryRO } from "./advertcategory.interface";
import { AdvertCategoryService } from "./advertcategory.service";
import { CreateAdvertCategoryDto } from "./dto/create-advertcategory";
import { UpdateAdvertCategoryDto } from "./dto/update-advertcategory";

@Controller('advertcategory')
@ApiBearerAuth()
@ApiTags('advertcategory')
export class AdvertCategoryController {
    constructor(private readonly advertcategoryservice: AdvertCategoryService) { }
    @Post()
    @ApiOperation({ summary: 'Create Advert Category' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 201, description: 'Advert Category successfully created' })
    create(@Body()dto:CreateAdvertCategoryDto) {
        return this.advertcategoryservice.create(dto);
    }

    @Put(':id')
    @ApiResponse({ status: 201, description: 'Update Successfull.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiOperation({ summary: 'Update Advert Category' })
    async update(
        @Param('id') id: string,
        @Body()dto: UpdateAdvertCategoryDto,
    ): Promise<AdvertCategoryRO> {
        return await this.advertcategoryservice.update(id, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get Advert Category' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 201, description: 'Success' })
    async findAll(): Promise<AdvertCategoryRO[]> {
        return await this.advertcategoryservice.findAll();
    }

    @Delete(':id')
    @ApiResponse({ status: 201, description: 'Delete Successfull.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiOperation({ summary: 'Delete Advert Category' })
    async remove(@Param('id') id: string): Promise<any> {
        if (id === null) {
            throw new HttpException(
                { error: `Advert Category does not exists` },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
        return await this.advertcategoryservice.remove(id);
    }

}