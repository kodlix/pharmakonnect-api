/* eslint-disable prettier/prettier */
import { AccountEntity } from "src/account/entities/account.entity";
import { PackageFeatureEntity } from "src/package/entities/packagefeature.entity";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Entity, Column, ManyToOne } from "typeorm";

@Entity('Feature')
export class FeatureEntity extends AbstractBaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  valueType: string;

  @Column({ nullable: true })
  value: string;

  @Column({ nullable: true })
  unit: string;

  @ManyToOne(() => AccountEntity, (s) => s.feature)
  account: AccountEntity;

  @Column('uuid')
  accountId: string;


  @ManyToOne(() => PackageFeatureEntity, (s) => s.feature)
  package: PackageFeatureEntity;

}