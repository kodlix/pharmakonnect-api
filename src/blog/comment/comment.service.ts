import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountService } from 'src/account/account.service';
import { Repository } from 'typeorm';
import { ArticleService } from '../article/article.service';
import { CommentDto } from './dto/comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity) private readonly commentRepo: Repository<CommentEntity>,
    @Inject(forwardRef(() => ArticleService)) private readonly articleService: ArticleService,
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
    userEmail: string
  ): Promise<CommentEntity> {
    const article = await this.articleService.findOne(articleId);
    const comment = new CommentEntity();
    comment.article = article;
    comment.message = commentDto.message;
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

}
