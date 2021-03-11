import { ArticleEntity } from 'src/blog/article/entities/article.entity';
import { AbstractBaseEntity } from 'src/_common/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';


@Entity('Comment')
export class CommentEntity extends AbstractBaseEntity {

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

  @ManyToOne(type => ArticleEntity, article => article.comment)
  article?: ArticleEntity;

}
