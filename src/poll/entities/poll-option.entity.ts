import { AbstractBaseEntity } from "src/_common/base.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { PollQuestionEntity } from "./poll-question.entity";
import { PollEntity } from "./poll.entity";


@Entity('PollOption')
export class PollOptionEntity extends BaseEntity
 {
    @PrimaryColumn()
    id: string;

    @Column()
    pollId: string;

    @Column()
    questionId: string;

    @Column()
    questionType: string;

    @Column()
    content: string;

    @Column({type: 'bool', default: true})
    active: boolean;

    @Column({type: 'bool', default: false})
    isCorrect: boolean;

    @Column()
    createdBy: string;

    @Column({default: new Date()})
    createdAt: Date;

    @ManyToOne(() => PollQuestionEntity, (q) => q.options)
    question: PollQuestionEntity;

    @ManyToOne(() => PollEntity, (q) => q.options)
    poll: PollEntity;

    
}
