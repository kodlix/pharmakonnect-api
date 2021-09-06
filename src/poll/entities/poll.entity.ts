import { AccountEntity } from "src/account/entities/account.entity";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { accessLevels } from "src/_common/constants/access-level";
import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { PollOptionEntity } from "./poll-option.entity";
import { PollQuestionEntity } from "./poll-question.entity";
import { PollVoteEntity } from "./poll-vote.entity";


@Entity('Poll')
export class PollEntity extends AbstractBaseEntity {
    @PrimaryColumn({ length: 550 })
    id: string;

    @Column({ length: 550 })
    title: string;

    @Column({ length: 600, nullable: true })
    slug: string;

    @Column({ length: 550 })
    description: string;

    @Column({ length: 550, nullable: true })
    url: string;

    @Column({ length: 50, nullable: true })
    accessCode: string;

    @Column({length: 50, nullable: true})
    accessLevel: string;

    @Column({length: 50, nullable: true})
    group: string;

    @Column({ type: 'bool', default: false })
    requiresLogin: boolean;

    @Column({ length: 50 })
    type: string;

    @Column({ length: 500, nullable: true })
    hint: string;

    @Column({ type: 'bool', default: false })
    published: boolean;

    @Column({ type: 'bool', default: false })
    rejected: boolean;

    @Column({ nullable: true })
    publishedAt: Date;

    @Column({ type: 'varchar', nullable: true })
    publishedBy: string;   

    @Column({default: new Date()})
    startDate: Date;

    @Column({default: new Date()})
    endDate: Date;
    
    @Column({ type: 'time', name: 'startTime', default: (): string => 'LOCALTIMESTAMP'})
    startTime: Date;

    @Column({ type: 'time', name: 'endTime', default: (): string => 'LOCALTIMESTAMP'})
    endTime: Date;


    @Column({ nullable: false })
    accountId: string;

    @Column({ type: 'bool', default: true })
    active: boolean;

    @Column({ nullable: true })
    message: string;

    @Column({ nullable: true })
    owner: string;
    
    @ManyToOne(() => AccountEntity, acc => acc.polls)
    account: AccountEntity;

    @OneToMany(() => PollQuestionEntity, (x) => x.poll, { cascade: ['insert', 'update', 'remove'] })
    questions: PollQuestionEntity[];

    @OneToMany(() => PollOptionEntity, (x) => x.poll, { cascade: ['insert', 'update', 'remove'] })
    options: PollOptionEntity[];

    @OneToMany(() => PollVoteEntity, (x) => x.poll, { cascade: ['insert', 'update', 'remove'] })
    votes: PollVoteEntity[];

}
