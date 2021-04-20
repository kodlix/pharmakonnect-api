import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountService } from 'src/account/account.service';
import { AccountEntity } from 'src/account/entities/account.entity';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { CommentService } from '../comment/comment.service';
import { ArticleDto } from './dto/article.dto';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity) private readonly articleRepo: Repository<ArticleEntity>,
    private readonly catService: CategoryService,
    @Inject(forwardRef(() => AccountService)) private readonly accountService: AccountService,
    @Inject(forwardRef(() => CommentService)) private readonly commentService: CommentService,
  ) { }


  public getCount(): Promise<number> {
    return this.articleRepo.count({});
  }

  public findAll(page = 1, take = 25): Promise<ArticleEntity[]> {
    return this.articleRepo.find({ relations: ['comments', 'categories', 'author'],
      skip: take * (page - 1), take,
      order: { published: 'ASC', createdAt: 'DESC' },
    });
  }


  public findAllPublished(page = 1, take = 25): Promise<ArticleEntity[]> {
    return this.articleRepo.find( { 
      where: { published : true }, 
      relations: ['comments', 'categories', 'author'],
      skip: take * (page - 1), take,
      order: { createdAt: 'DESC' },
    });
  }

  public getArticlesCountByUser(user: AccountEntity): Promise<number> {
    return this.articleRepo.count({ where: { author: user } });
  }

  public getArticlesByUser(user: AccountEntity, page = 1, take = 25): Promise<ArticleEntity[]> {
    return this.articleRepo.find({ relations: ['comments', 'categories'],
      skip: take * (page - 1), take,
      order: { createdAt: 'DESC' },
      where: { author: user }
    });
  }

  async getArticlesCountByCategory(category: CategoryEntity): Promise<number> {
    const articlesCount = await this.articleRepo
      .createQueryBuilder('article')
      .innerJoin('article.categories', 'category', 'category.id = :catId', { catId: category.id })
      .getCount();
    return articlesCount;
  }

  public async getArticlesByCategory(category: CategoryEntity, page = 1, take = 25): Promise<ArticleEntity[]> {
    const articles = await this.articleRepo
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'user', 'user.id = article.author') 
      .leftJoinAndSelect('article.comments', 'comment', 'comment.article = article.id') 
      .innerJoinAndSelect('article.categories', 'category', 'category.id = :catId', {
        catId: category.id,
      })
      .skip((page - 1) * take)
      .take(take)
      .orderBy('article.createdAt', 'DESC')
      .getMany();
    return articles;
  }

  public async getArticlesCountByAuthor(author: AccountEntity): Promise<number> {
    const articlesCount = await this.articleRepo.count({ where: { author } });
    return articlesCount;
  }

  public async getArticlesByAuthor(author: AccountEntity, page = 1, take = 25): Promise<ArticleEntity[]> {
    const articles = await this.articleRepo.find({ where: { author },
      order: { createdAt: 'DESC' },
      take, skip: (page - 1) * take,
      relations: ['comments', 'categories', 'author'],
    });
    return articles;
  }

  public findOne(articleId: string): Promise<ArticleEntity> {
    return this.articleRepo.findOneOrFail(articleId, {
      relations: ['comments', 'categories', 'author'],
    });
  }

  public async create(articleDto: ArticleDto, userEmail: string): Promise<ArticleEntity> {
    const articleToCreate: ArticleEntity = { ...articleDto };
    articleToCreate.author = await this.accountService.getOneUserByEmail(userEmail);
    articleToCreate.categories = await this.categoryIdsToEntities(articleDto.categoryIds);
    return this.articleRepo.save(articleToCreate);
  }

  public async update(articleId: string, articleDto: ArticleDto): Promise<ArticleEntity> {
    await this.articleRepo.findOneOrFail(articleId);
    const categoryIds = [...articleDto.categoryIds];
    delete articleDto.categoryIds;

    const articleDtoWithPayload: ArticleEntity = {
      editedAt: new Date(),
      ...articleDto,
    };
    await this.articleRepo.update(articleId, articleDtoWithPayload);
    const articleUpdated = await this.articleRepo.findOneOrFail(articleId);
    articleUpdated.categories = await this.categoryIdsToEntities(categoryIds);
    return await this.articleRepo.save(articleUpdated);
  }

  public async remove(articleId: string): Promise<ArticleEntity> {
    const article = await this.articleRepo.findOneOrFail(articleId, { relations: ['comments'] });
    for (const com of article.comments) {
      await this.commentService.remove(com.id);
    }
    return this.articleRepo.remove(article);
  }

  // private
  private async categoryIdsToEntities(catIds: string[]): Promise<CategoryEntity[]> {
    const entities: CategoryEntity[] = [];
    for (const catId of catIds) {
      const entity = await this.catService.getOneCategory(catId);
      entities.push(entity);
    }
    return entities;
  }

  public async publish(articleId): Promise<ArticleEntity> {
    const article = await this.articleRepo.findOne(articleId);
    if (!article) {
      throw new BadRequestException("article does not exist");
    }
    if (article.published) {
      throw new BadRequestException("article has been published already.");
    }
    const published = await article.publishArticle();
    await this.articleRepo.update(articleId, published);
    
    const result = await this.articleRepo.findOne(articleId);
    return result;
  }

  public async reject(articleId, message): Promise<ArticleEntity> {
    const article = await this.articleRepo.findOne(articleId);
    if (!article) {
      throw new BadRequestException("article does not exist");
    }
    if (article.rejected) {
      throw new BadRequestException("article has been rejected already.");
    }
    const rejectedArticle = await article.rejectArticle(message);
    await this.articleRepo.update(articleId, rejectedArticle);
    
    const result = await this.articleRepo.findOne(articleId);
    return result;
  }


  public async likeArticle(articleId): Promise<ArticleEntity> {
    const article = await this.articleRepo.findOne(articleId);
    if (!article) {
      throw new BadRequestException("article does not exist");
    }
    const liked = await article.likeArticle();
    await this.articleRepo.update(articleId, liked);
    
    const result = await this.articleRepo.findOne(articleId);
    return result;
  }

  public async dislikeArticle(articleId): Promise<ArticleEntity> {
    const article = await this.findOne(articleId);
    if (!article) {
      throw new BadRequestException("article does not exist");
    }
    const disliked = await article.dislikeArticle();
    await this.articleRepo.update(articleId, disliked);

    const result = await this.articleRepo.findOne(articleId);
    return result;
  }


}
