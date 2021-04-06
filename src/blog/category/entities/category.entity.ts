import { ArticleEntity } from 'src/blog/article/entities/article.entity';
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';


@Entity('Category')
export class CategoryEntity {
 
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  title?: string;

  @Column({ type: 'text', default: '', nullable: true })
  body?: string;

  @Column()
  createdBy?: string

  @CreateDateColumn({ name: 'createdAt' })
  createdAt?: Date

  @ManyToMany(type => ArticleEntity, article => article.categories)
  articles?: ArticleEntity[];

}
