/* eslint-disable prettier/prettier */
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity } from "typeorm";

@Entity('OrganizationCategory')
export class OrganizationCategoryEntity extends AbstractBaseEntity{

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({default: false})
    requiresPremise: boolean;


}
