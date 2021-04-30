import { AccountEntity } from 'src/account/entities/account.entity';
import { CategoryEntity } from 'src/blog/category/entities/category.entity';
import { CommentEntity } from 'src/blog/comment/entities/comment.entity';
import {
    Column,
  CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
    
  @Entity('Article')
  export class ArticleEntity {
   
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column()
    createdBy?: string
  
    @CreateDateColumn()
    createdAt?: Date

    @Column()
    title?: string;
  
    @Column({ type: 'text' })
    body?: string;
    
    @Column({ nullable: true })
    editedAt?: Date;
  
    @Column({ default: false })
    published?: boolean;

    @Column({ default: false })
    rejected?: boolean;

    @Column({ length: 512,  nullable: true })
    rejectMessage?: string;
  
    @Column({ default: 0 })
    claps?: number;
  
    @Column({ default: 0 })
    views?: number;

    @Column({ default: 0 })
    likes?: number;

    @Column({ default: 0 })
    dislikes?: number;

    publishArticle?(): ArticleEntity{
      this.published = true;
      this.rejected = false;
      this.editedAt = new Date();
      return this;
    }

    rejectArticle?(message: string): ArticleEntity{
      this.rejected = true;
      this.published = false;
      this.rejectMessage = message;
      this.editedAt = new Date();
      return this;
    }

    likeArticle?(): ArticleEntity {
      this.likes  = this.likes + 1;
      return this;
    }
  
    dislikeArticle?(): ArticleEntity {
      this.dislikes  = this.dislikes + 1;
      return this;
    }
  
    @OneToMany(type => CommentEntity, comment => comment.article)
    comments?: CommentEntity[];
  
    @ManyToOne(type => AccountEntity, user => user.articles)
    author?: AccountEntity;
  
    @ManyToMany(type => CategoryEntity, category => category.articles)
    @JoinTable({ name: 'article_category'})
    categories?: CategoryEntity[];
  }
  