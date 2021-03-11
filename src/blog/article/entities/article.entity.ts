import { AccountEntity } from 'src/account/entities/account.entity';
import { CategoryEntity } from 'src/blog/category/entities/category.entity';
import { CommentEntity } from 'src/blog/comment/entities/comment.entity';
import { AbstractBaseEntity } from 'src/_common/base.entity';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
    
  @Entity('Article')
  export class ArticleEntity extends AbstractBaseEntity {
   
    @Column()
    title?: string;
  
    @Column({ type: 'text' })
    body?: string;
    
    @Column({ nullable: true })
    editedAt?: Date;
  
    @Column({ default: true })
    published?: boolean;
  
    @Column({ default: 0 })
    claps?: number;
  
    @Column({ default: 0 })
    views?: number;
  
    @OneToMany(type => CommentEntity, comment => comment.article)
    comment?: CommentEntity[];
  
    @ManyToOne(type => AccountEntity, user => user.articles)
    author?: AccountEntity;
  
    @ManyToMany(type => CategoryEntity, category => category.articles)
    @JoinTable({ name: 'article_category'})
    category?: CategoryEntity[];
  }
  