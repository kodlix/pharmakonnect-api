import { ArticleEntity } from 'src/blog/article/entities/article.entity';
import { UserLikeEntity } from 'src/user-like/entities/like.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';


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

  @ManyToOne(() => ArticleEntity, article => article.comments)
  article?: ArticleEntity;  

}
