import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { PollEntity } from "./poll.entity";


@Entity('PollVote')
export class PollVoteEntity extends AbstractBaseEntity
 {
    @Column()
    pollId: string;

    @Column({length: 50})
    pollType: string;

    @Column({length: 125})
    questionId: string;

    @Column({length: 125})
    questionType: string;

    @Column({length: 125, nullable: true})
    email: string;

    @Column({length: 125, nullable: true})
    phoneNumber: string;

    @Column({length: 125})
    optionId: string;

    @Column({length: 125, nullable: true})
    accountId: string;

    @Column({length: 550})
    content: string;

    @Column({type: 'bool', default: true})
    active: boolean;

    @ManyToOne(() => PollEntity, (x) => x.votes )
    poll: PollEntity;
    
}
