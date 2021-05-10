import { Exclude } from "class-transformer";
import { AccountEntity } from "src/account/entities/account.entity";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { AdvertCategoryEntity } from "./advertcategory.entity";
import { ClickEntity } from "./click.entity";
import { ImpressionEntity } from "./impressions.entity";

@Entity('Advert')
export class AdvertEntity extends AbstractBaseEntity{
    @Column({ nullable: true })
    title: string;

    @Column({ nullable: true })
    url: string;

    @Column({ nullable: true })
    publishedAt: string;

    @Column({ nullable: true })
    endDate: Date;

    @Column({ nullable: true })
    advertserId: string;

    @Column({ nullable: true })
    zone: string;

    @Column({ nullable: true })
    companyName: string;

    @Column({ nullable: true })
    website: string;


    @Column({ nullable: true })
    contactPerson: string;

    @Column({ nullable: true })
    contactPhoneNumber: string;

    @Column('uuid')
    advertCategoryId

    @Column({ nullable: true })
    advertImage: string;

    @OneToOne(() => AdvertCategoryEntity, (s) => s.advert)
    advertCategory: AdvertCategoryEntity;

    @OneToMany(() => ClickEntity, (s) => s.advert)
    click: ClickEntity[];

    @OneToMany(() => ImpressionEntity, (s) => s.advert)
    impression: ImpressionEntity[];

    @ManyToOne(() => AccountEntity, (s) => s.advert)
    account: AccountEntity;

    @Column('uuid')
    accountId: string;



}