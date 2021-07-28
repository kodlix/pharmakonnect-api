import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractBaseEntity } from "src/_common/base.entity";
@Entity("GroupMember")
export class GroupMemberEntity extends AbstractBaseEntity {

    @Column({type: "uuid"})
    ownerId: string

    @Column({type: "uuid"})
    contactId: string

    @Column({type: "uuid"})
    groupId: string

}