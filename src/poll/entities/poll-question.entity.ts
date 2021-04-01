import { AccountEntity } from 'src/account/entities/account.entity';
import { AbstractBaseEntity } from 'src/_common/base.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { PollOptionEntity } from './poll-option.entity';
import { PollEntity } from './poll.entity';

@Entity('PollQuestion')
export class PollQuestionEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  pollId: string;

  @Column()
  pollType: string;

  @Column()
  questionType: string;

  @Column({ type: 'int' })
  SN: Number;

  @Column()
  content: string;

  @Column({ type: 'bool', default: true })
  active: boolean;

  @Column()
  createdBy: string;

  @CreateDateColumn({ name: 'createdAt', default: new Date() })
  createdAt: Date;

  @OneToMany(() => PollOptionEntity, (x) => x.question, { cascade: ['insert', 'update'] })
  options: PollOptionEntity[];

  @ManyToOne(() => PollEntity, (p) => p.questions)
  poll: PollEntity;
}
