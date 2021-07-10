import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountService } from 'src/account/account.service';
import { AccountEntity } from 'src/account/entities/account.entity';
import { NotificationType } from 'src/enum/enum';
import { NotificationRO } from 'src/notifications/notification/interface/notification.interface';
import { NotificationRepository } from 'src/notifications/notification/notification.repository';
import { NotificationTypeRepository } from 'src/notifications/notificationtype/notificationtype.repository';
import { UserLikeService } from 'src/user-like/like.service';
import { Brackets, Connection, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { CommentService } from '../comment/comment.service';
import { ArticleDto } from './dto/article.dto';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticleService {
  
  private  notTypeRepo: NotificationTypeRepository;
  private  notiRepo: NotificationRepository
  constructor(
    @InjectRepository(ArticleEntity) private readonly articleRepo: Repository<ArticleEntity>,
    private readonly catService: CategoryService,
    @Inject(forwardRef(() => AccountService)) private readonly accountService: AccountService,
    @Inject(forwardRef(() => UserLikeService)) private readonly userLikeService: UserLikeService,
    @Inject(forwardRef(() => CommentService)) private readonly commentService: CommentService,
    connection: Connection
  ) { 
      this.notTypeRepo = connection.getCustomRepository(NotificationTypeRepository);
      this.notiRepo = connection.getCustomRepository(NotificationRepository);
  }

  

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
      .orderBy('article.editedAt', 'DESC')
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
    const author = await this.accountService.findByEmail(userEmail);

    if (author && !author.isRegComplete) {
      throw new Error("Complete your profile registration to be able to create blogs.");      
    }
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
    
    const result = await this.articleRepo.findOne({where:{id: articleId}, relations: ['author']});

      const notType = await this.notTypeRepo.findOne({where: {name: NotificationType.BLOG}});

      const {id, profileImage} = await this.accountService.findByEmail("admin@netopng.com");
      
      const noti: NotificationRO = {
        message: `Hi ${result.author.firstName}, your article has been published`,
        senderId: id,
        entityId: article.id,
        recieverId: result.author.id,
        isGeneral: false,
        accountId: result.author.id,
        seen: false,
        senderImageUrl: profileImage ? profileImage : null,
        notificationType: notType,
        createdBy: "admin@netopng.com"
      }

      try {
        await this.notiRepo.save(noti);

      } catch (err) {
        Logger.log(err);
        return result;
      }

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
    
    const result = await this.articleRepo.findOne({where:{id: articleId}, relations: ['author']});

    const notType = await this.notTypeRepo.findOne({where: {name: NotificationType.BLOG}});
      
      const {id, profileImage} = await this.accountService.findByEmail("admin@netopng.com");
      
      const noti: NotificationRO = {
        message: `Hi ${result.author.firstName}, your article has been rejected: Rejection Reason: ${article.rejectMessage}`,
        senderId: id,
        entityId: article.id,
        recieverId: result.author.id,
        isGeneral: false,
        accountId: result.author.id,
        seen: false,
        senderImageUrl: profileImage ? profileImage : null,
        notificationType: notType,
        createdBy: "admin@netopng.com"
      }

      try {
        await this.notiRepo.save(noti);
      } catch (err) {
        Logger.log(err);
        return result;
      }

    return result;
  }


  public async likeArticle(accountId : string, articleId: string): Promise<ArticleEntity> {
    const article = await this.articleRepo.findOne(articleId);
    if (!article) {
      throw new BadRequestException("article does not exist");
    }

    const hasLiked = await this.userLikeService.hasLikedArticle(accountId, articleId);

    if(!hasLiked){
     article.likes += 1;
     const hasDisliked = await this.userLikeService.hasdislikedArticle(accountId, articleId);
     if (hasDisliked && article.dislikes > 0) {
      article.dislikes -= 1;
      await this.userLikeService.resetDisLike(accountId, articleId, "article");
     }
     await this.userLikeService.likeArticle(accountId, articleId);
    }     
     
    const result = await this.articleRepo.save(article);    
    return result; 
  }

  public async dislikeArticle(accountId, articleId): Promise<ArticleEntity> {
    const article = await this.articleRepo.findOne(articleId);
    if (!article) {
      throw new BadRequestException("article does not exist");
    }

    const hasDisliked= await this.userLikeService.hasdislikedArticle(accountId, articleId);

    if(!hasDisliked){
     article.dislikes += 1;
     const hasLiked = await this.userLikeService.hasLikedArticle(accountId, articleId); //check if user has liked this article before
     if (hasLiked && article.likes > 0) {
      article.likes -= 1;
      await this.userLikeService.resetLike(accountId, articleId, "article");
     }
     await this.userLikeService.dislikeArticle(accountId, articleId);
    }      
     
    const result = await this.articleRepo.save(article);    
    return result;  
  }

  public async viewArticle(articleId): Promise<ArticleEntity> {
    const article = await this.articleRepo.findOne(articleId);
    if (!article) {
      return;
    }
    
    article.views += 1;
    const result = await this.articleRepo.save(article);    
    return result;  
  }


  public async searchBlog(search: string, page: number): Promise<ArticleEntity[]> {
    if(search) {
      const blogs =  await this.articleRepo.createQueryBuilder("article")
          .leftJoinAndSelect("article.author", "author")
          .leftJoinAndSelect("article.comments", "comments")
          .leftJoinAndSelect("article.categories", "categories")
          .where(new Brackets(qb => {
                qb.where("article.title ILike :title", { title: `%${search}%` })
                .orWhere("article.body ILike :body", { body: `%${search}%` })
                .orWhere("article.rejectMessage ILike :rejectMessage", { rejectMessage: `%${search}%` })
               }))
            .orderBy("article.editedAt", "DESC")
            .take(25)
            .skip(25 * (page ? page - 1 : 0))
            .getMany();

       return blogs;
   }

   const blogs = await this.articleRepo.find({ relations: ['comments', 'categories', 'author'],
       order: { editedAt: 'DESC' },
       take: 25, skip: page ? 25 * (page - 1) : 0
    });

    return blogs;
  }

}
