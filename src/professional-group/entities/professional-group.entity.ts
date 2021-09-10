/* eslint-disable prettier/prettier */
import { AccountEntity } from "src/account/entities/account.entity";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity, ManyToMany, ManyToOne } from "typeorm";

@Entity('ProfessionalGroup')
export class ProfessionalGroupEntity extends AbstractBaseEntity{

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToMany(type => AccountEntity, ac => ac.professionalGroups)
    users?: AccountEntity[];

}
