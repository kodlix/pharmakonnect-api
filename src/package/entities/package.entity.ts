/* eslint-disable prettier/prettier */
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity } from "typeorm";

@Entity('Package')
export class PackageEntity extends AbstractBaseEntity{

    @Column()
    name: string;

    @Column()
    description: string;

}
