/* eslint-disable prettier/prettier */
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity } from "typeorm";

@Entity('ResourceType')
export class ResourceTypeEntity extends AbstractBaseEntity{

    @Column()
    name: string;

    @Column()
    description: string;

}
