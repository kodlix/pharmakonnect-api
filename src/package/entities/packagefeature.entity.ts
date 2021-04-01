/* eslint-disable prettier/prettier */
import { AccountEntity } from "src/account/entities/account.entity";
import { FeatureEntity } from "src/features/entity/feature.entity";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Entity, Column, ManyToOne, OneToMany } from "typeorm";

@Entity('PackageFeature')
export class PackageFeatureEntity extends AbstractBaseEntity{
    @Column({ nullable: false })
    packageId: string;

    @Column({ nullable: false })
    packageName: string;

    @OneToMany(() => FeatureEntity, (s) => s.package)
    feature: FeatureEntity[];

    @Column({ nullable: false })
    featureId: string;

    @Column({ nullable: false })
    featureName: string;

    @ManyToOne(() => AccountEntity, (s) => s.package)
    account: AccountEntity;
  
    @Column('uuid')
    accountId: string;

}