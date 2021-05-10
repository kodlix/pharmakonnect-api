import { Exclude } from "class-transformer";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AdvertEntity } from "./advert.entity";

@Entity('AdvertCategory')
export class AdvertCategoryEntity{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => AdvertEntity, (s) => s.advertCategory)
    advert: AdvertEntity;

    @Column({ type: 'bool', default: false })
    isDeleted: boolean = false;

}