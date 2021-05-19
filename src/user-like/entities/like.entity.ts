import { CommentEntity } from 'src/blog/comment/entities/comment.entity';
import { ArticleEntity } from 'src/blog/article/entities/article.entity';
import {
    Column,
  CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
    
  @Entity('UserLike')
  export class UserLikeEntity {
   
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column()
    accountId: string
    
    @Column({nullable: true})
    articleId?: string

    @Column({nullable: true})
    commentId?: string
    
    @Column({default: false})
    isLike: boolean

    @Column({default: false})
    isDislike: boolean

    @CreateDateColumn()
    createdOn?: Date;
  }
  