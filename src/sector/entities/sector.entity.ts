import { BaseEntity, Column, Entity } from "typeorm";
import { AbstractBaseEntity } from "src/_common/base.entity";


@Entity('Sector')
export class SectorEntity extends AbstractBaseEntity{
    @Column()
    name : string

    @Column()
    description : string

    @Column()
    isSystemDefined : boolean
}
