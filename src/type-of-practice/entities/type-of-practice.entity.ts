/* eslint-disable prettier/prettier */
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity } from "typeorm";

@Entity('TypeOfPractice')
export class TypeOfPracticeEntity extends AbstractBaseEntity{

    @Column()
    name: string;

    @Column()
    description: string;

}
