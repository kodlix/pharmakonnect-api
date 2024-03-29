import { forwardRef, Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from 'src/account/account.module';
import { CategoryModule } from '../category/category.module';
import { CommentModule } from '../comment/comment.module';
import { ArticleEntity } from './entities/article.entity';
import { LikeModule } from 'src/user-like/like.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity]),
    AccountModule,
    CategoryModule,
    forwardRef(() => CommentModule),
    forwardRef(() => AccountModule),
    forwardRef(() => LikeModule),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
