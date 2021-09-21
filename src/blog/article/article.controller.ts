import { Controller, Get, Post, Body, Put, Param, Delete, HttpException, HttpStatus, Query, Req, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountService } from 'src/account/account.service';
import { CategoryService } from '../category/category.service';
import { ArticleService } from './article.service';
import { ArticleDto, RejectArticleDto } from './dto/article.dto';
import { editFileName, imageFileFilter } from 'src/_utility/fileupload.util';
import { uploadFile } from 'src/_utility/upload.util';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly categoryService: CategoryService,
    private readonly userService: AccountService,
  ) { }

  @Get('/count')
  async getCount() {
    try {
      return await this.articleService.getCount();
    } catch (err) {
      throw new HttpException(err, HttpStatus.NO_CONTENT);
    }
  }

  @Get()
  findAll(@Query('page') page: number, @Query('take') take: number) {
    try {
      return this.articleService.findAll(page, take);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Get('/search')
  searchBlog(@Query('page') page: number, @Query('search') search: string) {
    try {
      return this.articleService.searchBlog(search, page);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Get("/published")
  findAllPublished(@Query('page') page: number, @Query('take') take: number) {
    try {
      return this.articleService.findAllPublished(page, take);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':articleId')
  async findOne(@Param('articleId') articleId: string) {
    try {
      return await this.articleService.findOne(articleId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('coverImage', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(@UploadedFile() file, @Body() articleDto: ArticleDto, @Req() req: any, @UploadedFile() postImage: any) {
    console.log(file);
    try {
      let imageUrl = "";
      if (postImage) {
        imageUrl = await uploadFile(postImage.path);
        articleDto.coverImage = imageUrl;
      }
      const catIds = articleDto.categoryIds.split(',');
      articleDto.createdBy = req.user.createdBy;
      articleDto.categoryIds = catIds;
      return await this.articleService.create(articleDto, req.user.email);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Put(':articleId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('coverImage', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async update(@UploadedFile() file, @Param('articleId') articleId: string, @Body() articleDto: ArticleDto, @UploadedFile() postImage: any) {
    try {
      if(!articleDto.categoryIds){
        throw new BadRequestException("Category is missing.");
      }

      let imageUrl = "";
      if (postImage) {
        imageUrl = await uploadFile(postImage.path);
        articleDto.coverImage = imageUrl;
      } 

      const catIds = articleDto.categoryIds.split(',');
      articleDto.categoryIds = catIds;
      return await this.articleService.update(articleId, articleDto);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Put(':articleId/publish')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async publish(@Param('articleId') articleId: string) {
    try {
      return await this.articleService.publish(articleId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':articleId/reject')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async reject(@Param('articleId') articleId: string, @Body() rejectDto: RejectArticleDto) {
    try {
      return await this.articleService.reject(articleId, rejectDto.message);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':articleId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async remove(@Param('articleId') articleId: string) {
    try {
      return await this.articleService.remove(articleId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Get('category/:categoryId/count')
  async getCountByCategory(@Param('categoryId') categoryId: string) {
    try {
      const category = await this.categoryService.getOneCategory(categoryId);
      return await this.articleService.getArticlesCountByCategory(category);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NO_CONTENT);
    }
  }

  @Get('category/:categoryId')
  async getByCategory(
    @Param('categoryId') categoryId: string,
    @Query('page') page: number, @Query('take') take: number) {
    try {
      const category = await this.categoryService.getOneCategory(categoryId);
      return await this.articleService.getArticlesByCategory(category, page, take);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NO_CONTENT);
    }
  }

  @Get('user/:userId/count')
  async getCountByAuthor(@Param('userId') userId: string) {
    try {
      const author = await this.userService.getOneUserById(userId);
      return await this.articleService.getArticlesCountByAuthor(author);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NO_CONTENT);
    }
  }

  @Get('user/:userId')
  async getByAuthor(
    @Param('userId') userId: string,
    @Query('page') page: number, @Query('take') take: number) {
    try {
      const author = await this.userService.getOneUserById(userId);
      return await this.articleService.getArticlesByAuthor(author, page, take);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NO_CONTENT);
    }
  }

  @Get('user/published/:userId/:currentBlogId')
  async getByAuthorPublsihed(
    @Param('userId') userId: string, @Param('currentBlogId') currentBlogId: string) {
    try {
      const author = await this.userService.getOneUserById(userId);
      return await this.articleService.getPubArticlesByAuthor(author, currentBlogId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NO_CONTENT);
    }
  }

  @Put('/like/:articleId')
  @ApiResponse({ status: 201, description: 'liked article successfully.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Like Article' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  likeArticle(@Param('articleId') articleId: string,  @Req() req ) {
    try {
      const { user } = req;
      return this.articleService.likeArticle(user.id, articleId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }


  @Put('/dislike/:articleId')
  @ApiResponse({ status: 201, description: 'disliked article successfully.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Dislike Article' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  dislikeArticle(@Param('articleId') articleId: string,  @Req() req ) {
    try {
      const { user } = req;
      return this.articleService.dislikeArticle(user.id, articleId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Put('/view/:articleId')
  @ApiResponse({ status: 201, description: 'article  viewd successfully.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'View Article' })
  // @UseGuards(AuthGuard())
  viewArticle(@Param('articleId') articleId: string, @Req() req: any ) {
    try {
      return this.articleService.viewArticle(articleId, req.user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }
  
  
    // upload single file
    @Put('/uploads')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @UseInterceptors(
      FileInterceptor('image', {
        storage: diskStorage({
          destination: './uploads',
          filename: editFileName,
        }),
        fileFilter: imageFileFilter,
      }),
    )
    async uploadedFile(@UploadedFile() file, @Body() articleDto: ArticleDto, @Req() req) {
      if (!file) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'no file to upload',
          data: file,
        };
      }
      const response = {
        originalname: file.originalname,
        filename: file.filename,
      };

      console.log(articleDto);
      
  
      // await this.accountService.updateProfileImage(file.filename, req.user.id);
  
      return {
        status: HttpStatus.OK,
        message: 'Image uploaded successfully!',
        data: response,
      };
    }
  

}
