/* eslint-disable prettier/prettier */
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity } from "typeorm";

@Entity('MembershipInterestGroup')
export class MembershipInterestGroupEntity extends AbstractBaseEntity{

    @Column()
    name: string;

    @Column()
    description: string;

}
