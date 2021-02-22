import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { AccountEntity } from "src/account/entities/account.entity"
import { GroupChatEntity } from "src/chat/entities/chat.groupChat"

@Entity("Participant")
export class ParticipantEntity extends AbstractBaseEntity{

    @ManyToOne(()=> AccountEntity, account => account.id)
    @Column()
    accountId : string

    @Column({default : "pharmaceutical"})
    sectorId : string

    @ManyToOne(()=> GroupChatEntity, groupchat => groupchat.id, { onDelete: 'CASCADE'})
    @Column({nullable : true})
    groupChatID : string

    @Column({default : true})
    canPost : boolean
}