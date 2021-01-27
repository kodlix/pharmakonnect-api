import { Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

export abstract class AbstractBaseEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    createdBy: string

    @CreateDateColumn({ name: 'createdAt', default: new Date() })
    createdAt: Date

    @UpdateDateColumn({ name: 'updatedAt', nullable: true })
    updatedAt: Date

    @Column({ type: 'bool', default: false })
    isDeleted: boolean = false;

    @Column({ type: 'bool', default: false })
    isSystemDefined: boolean = false;
}