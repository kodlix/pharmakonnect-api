import { ArticleEntity } from 'src/blog/article/entities/article.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


@Entity('Comment')
export class CommentEntity {

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  createdBy?: string

  @CreateDateColumn()
  createdAt?: Date

  @Column({ type: 'text' })
  message?: string;

  @Column({ nullable: true })
  editedAt?: Date;

  @Column({ default: false })
  offensive?: boolean;

  @Column({ default: 'n/a' })
  author?: string;

  @Column({ default: 0 })
  likes?: number;

  @Column({ default: 0 })
  dislikes?: number;


  likeComment?(): CommentEntity {
    this.likes  = this.likes + 1;
    return this;
  }

  dislikeComment?(): CommentEntity {
    this.dislikes  = this.dislikes + 1;
    return this;
  }

  @ManyToOne(type => ArticleEntity, article => article.comments)
  article?: ArticleEntity;



}
