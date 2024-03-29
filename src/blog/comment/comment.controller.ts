import { Controller, Get, Post, Body, Put, Param, Delete, Query, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';

@ApiTags('comment')
@Controller('article/:articleId/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Get()
  findAll(@Param('articleId') articleId: string, @Query('page') page: number, @Query('take') take: number) {
    try {
      return this.commentService.findAll(articleId, page, take);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':commentId')
  async findOne(@Param('commentId') commentId: string) {
    try {
      return await this.commentService.findOne(commentId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async create(@Param('articleId') articleId: string, @Body() commentDto: CommentDto, @Req() req: any) {
    try {
      commentDto.createdBy = req.user.createdBy;
      return await this.commentService.create(articleId, commentDto, req.user.email);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_ACCEPTABLE);
    }
  }

  @Put(':commentId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async update(@Param('commentId') commentId: string, @Body() commentDto: CommentDto) {
    try {
      return await this.commentService.update(commentId, commentDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_ACCEPTABLE);
    }
  }


  @Delete(':commentId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async remove(@Param('commentId') commentId: string) {
    try {
      return await this.commentService.remove(commentId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Put('/like/:commentId')
  @ApiResponse({ status: 201, description: 'liked comment successfully.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Like Comment' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  likeComment(@Param('commentId') commentId: string,  @Req() req ) {
    try {
      const { user } = req;
      return this.commentService.likeComment(user.id, commentId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Put('/dislike/:commentId')
  @ApiResponse({ status: 201, description: 'disliked comment successfully.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({ summary: 'Disike Comment' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  dislikeComment(@Param('commentId') commentId: string,  @Req() req ) {
    try {
      const { user } = req;
      return this.commentService.dislikeComment(user.id, commentId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

}
