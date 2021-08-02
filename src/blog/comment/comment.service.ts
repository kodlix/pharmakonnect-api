import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountService } from 'src/account/account.service';
import { UserLikeService } from 'src/user-like/like.service';
import { Repository, UpdateResult } from 'typeorm';
import { ArticleService } from '../article/article.service';
import { CommentDto } from './dto/comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity) private readonly commentRepo: Repository<CommentEntity>,
    @Inject(forwardRef(() => ArticleService)) private readonly articleService: ArticleService,
    @Inject(forwardRef(() => UserLikeService)) private readonly userLikeService: UserLikeService,
    @Inject(forwardRef(() => AccountService)) private readonly accountService: AccountService
  ) { }

  public async findAll(articleId: string, page: number, take: number): Promise<CommentEntity[]> {
    const article = await this.articleService.findOne(articleId);
    if (article) {
      return article.comments;
    }
  }


  public async findOne(commentId: string) {
    return this.commentRepo.findOneOrFail(commentId, {
      relations: ['article'],
    });
  }

  public async create(
    articleId: string,
    commentDto: CommentDto,
    userEmail: string,
    image: string
  ): Promise<CommentEntity> {
    const article = await this.articleService.findOne(articleId);
    const comment = new CommentEntity();
    comment.article = article;
    comment.message = commentDto.message;
    comment.createdBy = commentDto.createdBy;
    comment.authorImage = image;
    comment.author = (await this.accountService.getOneUserByEmail(userEmail)).email;
    const createdComment = await this.commentRepo.save(comment);
    return this.findOne(createdComment.id);
  }

  async update(commentId: string, commentDto: CommentDto): Promise<CommentEntity> {
    const comment = await this.commentRepo.findOneOrFail(commentId);
    const commentDtoWithPayload: CommentEntity = {
      editedAt: new Date(),
      ...commentDto,
    };
    await this.commentRepo.update(commentId, commentDtoWithPayload);
    return await this.commentRepo.findOneOrFail(commentId);
  }


  public async remove(commentId: string): Promise<CommentEntity> {
    const comment = await this.commentRepo.findOneOrFail(commentId);
    return this.commentRepo.remove(comment);
  }

  public async likeComment(accountId : string, commentId: string): Promise<CommentEntity> {
    const comment = await this.commentRepo.findOne(commentId);
    if (!comment) {
      throw new BadRequestException("comment does not exist");
    }

    const hasLiked = await this.userLikeService.hasLikedComment(accountId, commentId);

    if(!hasLiked){
     comment.likes += 1;
     const hasDisliked = await this.userLikeService.hasdislikedComment(accountId, commentId);
     if (hasDisliked && comment.dislikes > 0) {
      comment.dislikes -= 1;
      await this.userLikeService.resetDisLike(accountId, commentId, "comment");
     }
     await this.userLikeService.likeComment(accountId, commentId);
    }     
     
    const result = await this.commentRepo.save(comment);    
    return result; 
  }

  public async dislikeComment(accountId, commentId): Promise<CommentEntity> {
    const comment = await this.commentRepo.findOne(commentId);
    if (!comment) {
      throw new BadRequestException("comment does not exist");
    }

    const hasDisliked= await this.userLikeService.hasdislikedComment(accountId, commentId);

    if(!hasDisliked){
     comment.dislikes += 1;
     const hasLiked = await this.userLikeService.hasLikedComment(accountId, commentId); //check if user has liked this comment before
     if (hasLiked && comment.likes > 0) {
      comment.likes -= 1;
      await this.userLikeService.resetLike(accountId, commentId, "comment");
     }
     await this.userLikeService.dislikeComment(accountId, commentId);
    }      
     
    const result = await this.commentRepo.save(comment);    
    return result;  
  }

}
