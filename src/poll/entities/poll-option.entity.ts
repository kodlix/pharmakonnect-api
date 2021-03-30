import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity } from "typeorm";


@Entity('PollOption')
export class PollOptionEntity extends AbstractBaseEntity
 {
    @Column({length: 255})
    pollId: string;

    @Column({length: 255})
    questionId: string;

    @Column({length: 50})
    questionType: string;

    @Column({length: 550})
    content: string;

    @Column({type: 'bool', default: true})
    active: boolean;

    @Column({type: 'bool', default: false})
    isCorrect: boolean;
}
