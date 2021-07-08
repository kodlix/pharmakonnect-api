import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { editFileName, imageFileFilter } from "src/_utility/fileupload.util";
import { AdvertRO } from "./advert.interface";
import { AdvertService } from "./advert.service";
import { CreateAdvertDto } from "./dto/create-advert";
import { RejectAdvertDto, UpdateAdvertDto } from "./dto/update-advert";
import { diskStorage } from 'multer';
import { uploadFile } from "src/_utility/upload.util";



@Controller('advert')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiTags('advert')
export class AdvertController {
    constructor(private readonly advertservice: AdvertService) { }

    @UseInterceptors(
      FileInterceptor('advertImage', {
        storage: diskStorage({
          destination: './uploads',
          filename: editFileName,
        }),
        fileFilter: imageFileFilter,
      }),
    )
    @Post()
    @ApiOperation({ summary: 'Create Advert Category' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 201, description: 'Advert successfully created' })
    async create(@Body()dto: CreateAdvertDto,@Req() req: any, @UploadedFile() advertImage: any) {
        if(advertImage){
          const imageUrl = await uploadFile(advertImage.path);
          dto.advertImage = imageUrl;
          return this.advertservice.create(dto, req.user);
        }
        
    }

    @Get()
    @ApiOperation({ summary: 'Get all Advert' })
    @ApiResponse({ status: 201, description: 'Success.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiQuery({ name: 'page', required: false})
    @ApiQuery({ name: 'search', required: false})
    async findAll(@Req() req: any, @Query('page') page?: number, @Query('search') search?: string): Promise<AdvertRO[]> {
        return await this.advertservice.findAll( page, search);
    }

    @Get(':id') 
    @ApiResponse({ status: 201, description: 'Success.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiOperation({ summary: 'Get Advert by Id' })
    async findOne(@Param('id') id: string): Promise<AdvertRO> {
        return await this.advertservice.findOne(id);
    }

    @Get('apps/active')
    @ApiResponse({ status: 201, description: 'Success.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiOperation({ summary: 'Get Advert by AccountId' })
    async findByAccountId(@Query('page') page: number, @Req() req
    ): Promise<AdvertRO[]> {
        const { user } = req;

        return await this.advertservice.findByAccountId(user.id, page);
    }

    @Get('applications/active')
    @ApiResponse({ status: 201, description: 'Success.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiQuery({ name: 'page', required: false })
    @ApiOperation({ summary: 'Get Advert by Approved' })
    async findByApproved(@Query('page') page?: number): Promise<AdvertRO[]> {
      return await this.advertservice.findByApproved(page);
    }

    @UseInterceptors(
      FileInterceptor('advertImage', {
        storage: diskStorage({
          destination: './uploads',
          filename: editFileName,
        }),
        fileFilter: imageFileFilter,
      }),
    )
    @Put(':id')
    @ApiResponse({ status: 201, description: 'Update Successful.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiOperation({ summary: 'Update Advert' })
    async update(
        @Param('id') id: string,
        @Body() Dto: UpdateAdvertDto,
        @Req() req: any,
        @UploadedFile() file,
    ): Promise<AdvertRO> {
        return await this.advertservice.update(id, Dto, req.user,file ? file.filename : "" );
    }


    @Put('approve/:id')
  @ApiResponse({ status: 201, description: 'Approved.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Approve Advert' })
  async approve(
    @Param('id') id: string,
    @Req() req: any
  ): Promise<AdvertRO> {
    return await this.advertservice.updateApprove(id, req.user);
  }

  @Put('reject/:id')
  @ApiResponse({ status: 201, description: 'Rejected.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Reject Advert' })
  async reject(
    @Param('id') id: string,
    @Body() dto: RejectAdvertDto,
    @Req() req: any
  ): Promise<AdvertRO> {
    return await this.advertservice.updateReject(id, dto, req.user);
  }

   
  // // upload single file
  // @Put('/uploads')
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard())
  // @UseInterceptors(
  //   FileInterceptor('image', {
  //     storage: diskStorage({
  //       destination: './advertimages',
  //       filename: editFileName,
  //     }),
  //     fileFilter: imageFileFilter,
  //   }),
  // )
  // async uploadedFile(@UploadedFile() file, @Req() req) {
  //   if (!file) {
  //     return {
  //       status: HttpStatus.BAD_REQUEST,
  //       message: 'no file to upload',
  //       data: file,
  //     };
  //   }
  //   const response = {
  //     originalname: file.originalname,
  //     filename: file.filename,
  //   };

  //   await this.advertservice.uploadAdvertImage(file.advertImage, req.advertId);

  //   return {
  //     status: HttpStatus.OK,
  //     message: 'Image uploaded successfully!',
  //     data: response,
  //   };
  // }


    @Delete(':id')
    @ApiResponse({ status: 201, description: 'Delete Successfull.' })
    @ApiResponse({ status: 404, description: 'Not Found.' })
    @ApiOperation({ summary: 'Delete advert' })
    async remove(@Param('id') id: string): Promise<any> {
        if (id === null) {
            throw new HttpException(
                { error: `Outlet does not exists` },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
        return await this.advertservice.remove(id);
    }
}