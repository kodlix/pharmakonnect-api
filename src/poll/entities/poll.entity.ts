import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity } from "typeorm";


@Entity('Poll')
export class Poll extends AbstractBaseEntity
 {
    @Column({length: 550})
    title: string;

    @Column({length: 600})
    slug: string;

    @Column({length: 550})
    description: string;

    @Column({length: 550, nullable: true})
    url: string;

    @Column({length: 50, nullable: true})
    accessCode: string;

    @Column({type: 'bool', default: false})
    requireRegistration: boolean;

    @Column({length: 50})
    type: string;

    @Column({type: 'string'})
    content: string;

    @Column({type: 'bool', default: false})
    published: boolean;

    @Column({type: 'datetime'})
    publishedAt: Date;

    @Column({type: 'datetime'})
    startDate: Date;

    @Column({type: 'datetime'})
    endDate: Date;
}
