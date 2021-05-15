import { forwardRef, Module } from '@nestjs/common';
import { UserLikeService } from './like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from 'src/account/account.module';
import { UserLikeEntity } from './entities/like.entity';
import { ArticleModule } from 'src/blog/article/article.module';
import { CommentModule } from 'src/blog/comment/comment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLikeEntity]),
    AccountModule,
    forwardRef(() => ArticleModule),
    forwardRef(() => CommentModule),
    forwardRef(() => AccountModule),
    forwardRef(() => LikeModule),

  ],
  providers: [UserLikeService],
  exports: [UserLikeService],
})
export class LikeModule {}
