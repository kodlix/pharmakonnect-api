import { AbstractBaseEntity } from "src/_common/base.entity";
import { Entity, Column, OneToOne } from "typeorm";
import { AdvertEntity } from "./advert.entity";

@Entity('Impression')
export class ImpressionEntity extends AbstractBaseEntity{

    @Column("uuid")
    advertId: string;

    @Column({ nullable: true })
    impressionDate: Date;

    @Column({ nullable: true })
    sourceIp: string;

    @Column({ nullable: true })
    sessionIp: string;

    @OneToOne(() => AdvertEntity, (s) => s.impression)
    advert: AdvertEntity;

}