import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractBaseEntity } from "src/_common/base.entity";

@Entity("GroupMember")
export class GroupMemberEntity extends AbstractBaseEntity {

    @Column()
    ownerId: string

    @Column()
    contactId: string

    @Column()
    groupId: string

}