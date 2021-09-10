/* eslint-disable prettier/prettier */
import { AccountEntity } from "src/account/entities/account.entity";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity('MembershipInterestGroup')
export class MembershipInterestGroupEntity extends AbstractBaseEntity{

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToMany(type => AccountEntity, ac => ac.membershipInterestGroups)
    users?: AccountEntity[];

}
