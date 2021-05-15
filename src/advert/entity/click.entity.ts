import { AbstractBaseEntity } from "src/_common/base.entity";
import { Entity, Column, OneToOne } from "typeorm";
import { AdvertEntity } from "./advert.entity";

@Entity('Click')
export class ClickEntity extends AbstractBaseEntity{
  
    @Column({ nullable: true })
    clickDate: Date;

    @Column({ nullable: true })
    sourceIp: string;

    @Column({ nullable: true })
    sessionIp: string;

    @OneToOne(() => AdvertEntity, (s) => s.click)
    advert: AdvertEntity;

    @Column("uuid")
    advertId: string;

}