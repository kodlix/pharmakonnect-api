import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity } from "typeorm";


@Entity('PollUser')
export class PollUser extends AbstractBaseEntity
 {
    @Column({length: 50})
    name: string;

    @Column({length: 50})
    phonenumber: string;

    @Column({length: 50})
    email: string;

    @Column({length: 128, nullable: true})
    accountId: string;

    @Column({length: 128})
    pollId: string;

    @Column({type: 'datetime', default: new Date()})
    registeredAt: Date;

    @Column({type: 'bool', default: true})
    active: boolean;
}
