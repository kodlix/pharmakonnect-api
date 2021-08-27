/* eslint-disable prettier/prettier */
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity } from "typeorm";

@Entity('School')
export class SchoolEntity extends AbstractBaseEntity{

    @Column()
    name: string;
    
    @Column()
    address: string;

    @Column()
    city: string;

}
