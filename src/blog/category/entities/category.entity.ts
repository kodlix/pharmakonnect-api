import { ArticleEntity } from 'src/blog/article/entities/article.entity';
import { AbstractBaseEntity } from 'src/_common/base.entity';
import { Column, Entity, ManyToMany } from 'typeorm';


@Entity('Category')
export class CategoryEntity extends AbstractBaseEntity {
 
  @Column({ unique: true })
  title?: string;

  @Column({ type: 'text', default: '', nullable: true })
  body?: string;

  @ManyToMany(type => ArticleEntity, article => article.category)
  articles?: ArticleEntity[];
}
