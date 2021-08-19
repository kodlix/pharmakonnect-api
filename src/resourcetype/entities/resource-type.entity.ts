/* eslint-disable prettier/prettier */
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity } from "typeorm";

@Entity('ResourceType')
export class ResourceTypeEntity extends AbstractBaseEntity{

    @Column({type: "varchar", length: 128})
    name: string;

    @Column({type: "varchar", length: 128})
    description: string;

    @Column({type: "varchar", length: 128})
    module: string;

}
