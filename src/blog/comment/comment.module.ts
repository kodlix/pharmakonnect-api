import { forwardRef, Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentEntity } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from 'src/account/account.module';
import { ArticleModule } from '../article/article.module';
import { LikeModule } from 'src/user-like/like.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    AccountModule,
    forwardRef(() => AccountModule),
    forwardRef(() => ArticleModule),
    forwardRef(() => LikeModule),
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService]
})
export class CommentModule {}
