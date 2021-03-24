import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity } from "typeorm";


@Entity('PollQuestion')
export class PollQuestionEntity extends AbstractBaseEntity
 {
    @Column({length: 255})
    pollId: string;

    @Column({length: 150})
    pollType: string;

    @Column({length: 50})
    questionType: string;

    @Column({length: 550})
    content: string;

    @Column({type: 'bool', default: true})
    active: boolean;
}
