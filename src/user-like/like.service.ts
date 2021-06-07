import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLikeEntity } from './entities/like.entity';

@Injectable()
export class UserLikeService {
  constructor(
    @InjectRepository(UserLikeEntity) private readonly likeRepo: Repository<UserLikeEntity>
  ) { }


  public async hasLikedArticle(accountId : string, articleId : string): Promise<boolean> {   
    const like = await this.likeRepo.findOne({where: { accountId, articleId, isLike: true}})
    return !!like;
  }

  public async hasdislikedArticle(accountId : string, articleId : string): Promise<boolean> {   
    const dislike = await this.likeRepo.findOne({where: { accountId, articleId, isDislike: true}})
    const result =  !!dislike;
    return result;
  }

  public async hasLikedComment(accountId : string, commentId : string): Promise<boolean> {   
    const like = await this.likeRepo.findOne({where: { accountId, commentId, isLike: true}})
    return !!like;
  }

  public async hasdislikedComment(accountId : string, commentId : string): Promise<boolean> {   
    const dislike = await this.likeRepo.findOne({where: { accountId, commentId, isDislike: true}})
    return !!dislike;
  }


  public async likeArticle(accountId : string, articleId : string): Promise<UserLikeEntity> {   
      let newLike = new UserLikeEntity();
      newLike.accountId = accountId;
      newLike.articleId = articleId;
      newLike.isLike = true;

      return await this.likeRepo.save(newLike);
    }

    public async dislikeArticle(accountId : string, articleId : string): Promise<UserLikeEntity> {   
      let newLike = new UserLikeEntity();
      newLike.accountId = accountId;
      newLike.articleId = articleId;
      newLike.isDislike = true;

      return await this.likeRepo.save(newLike);
    }

    public async likeComment(accountId : string, articleId : string): Promise<UserLikeEntity> {   
      let newLike = new UserLikeEntity();
      newLike.accountId = accountId;
      newLike.articleId = articleId;
      newLike.isLike = true;

      return await this.likeRepo.save(newLike);
    }

    public async dislikeComment(accountId : string, articleId : string): Promise<UserLikeEntity> {   
      let newLike = new UserLikeEntity();
      newLike.accountId = accountId;
      newLike.articleId = articleId;
      newLike.isDislike = true;

      return await this.likeRepo.save(newLike);
    }

    public async resetLike(accountId : string, id : string, type: string): Promise<UserLikeEntity> {   
      if (type === 'article') {
        const article = await this.likeRepo.findOne({articleId: id, accountId, isLike: true})
        if (article) {
          article.isLike = false;
        }
        return await this.likeRepo.save(article);
      } else if(type == 'comment') {
        const comment = await this.likeRepo.findOne({commentId: id, accountId, isLike: true})
        if (comment) {
          comment.isLike = false;
        }
        return await this.likeRepo.save(comment);
      }      
    }

    public async resetDisLike(accountId : string, id : string, type: string): Promise<UserLikeEntity> {   
      if (type === 'article') {
        const article = await this.likeRepo.findOne({articleId: id, accountId, isDislike: true})
        if (article) {
          article.isDislike = false;
        }
        return await this.likeRepo.save(article);
      } else if(type == 'comment') {
        const comment = await this.likeRepo.findOne({commentId: id, accountId, isDislike: true})
        if (comment) {
          comment.isDislike = false;
        }
        return await this.likeRepo.save(comment);
      }      
    }

}
