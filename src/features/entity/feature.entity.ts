/* eslint-disable prettier/prettier */
import { AccountEntity } from "src/account/entities/account.entity";
import { PackageEntity } from "src/package/entities/package.entity";
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


  // @ManyToOne(() => PackageEntity, (s) => s.feature)
  // package: PackageEntity;

}