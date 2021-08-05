import { Column, Entity } from "typeorm";
import { AbstractBaseEntity } from "src/_common/base.entity";

@Entity("Group")
export class GroupEntity extends AbstractBaseEntity {

    @Column()
    ownerId: string

    @Column({nullable: true})
    ownerName: string

    @Column()
    name: string

    @Column()
    description: string

    @Column({ nullable: true })
    logo: string
    
}