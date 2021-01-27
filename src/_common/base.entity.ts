import { Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

export abstract class AbstractBaseEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    Id: number;
    @Column()
    CreatedBy: string

    @CreateDateColumn('CreatedAt')
    CreatedAt: Date

    @UpdateDateColumn('UpdatedAt')
    LastUpdatedAt: Date

    @Column({ type: 'bool', default: false })
    IsDeleted: boolean = false;

    @Column({ type: 'bool', default: false })
    IsSystemDefined: boolean = false;
}