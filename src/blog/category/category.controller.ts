import { Controller, Get, Post, Body, Put, Param, Delete, HttpException, HttpStatus, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get('/count')
  async getCount() {
    try {
      return await this.categoryService.getCount();
    } catch (err) {
      throw new HttpException(err, HttpStatus.NO_CONTENT);
    }
  }

  @Get()
  findAll(@Query('page') page: number, @Query('take') take: number) {
    try {
      return this.categoryService.findAll(page, take);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':categoryId')
  async findOne(@Param('categoryId') categoryId: string) {
    try {
      return await this.categoryService.findOne(categoryId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async create(@Body() catDto: CategoryDto, @Req() req: any) {
    try {
      catDto.createdBy = req.user.createdBy;
      return await this.categoryService.create(catDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_ACCEPTABLE);
    }
  }

  @Put(':categoryId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async update(@Param('categoryId') categoryId: string, @Body() categoryDto: CategoryDto) {
    try {
      return await this.categoryService.update(categoryId, categoryDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_ACCEPTABLE);
    }
  }

  @Delete(':categoryId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async remove(@Param('categoryId') categoryId: string) {
    try {
      return await this.categoryService.remove(categoryId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }


}
