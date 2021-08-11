import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { AccountEntity } from "src/account/entities/account.entity"
import { ConversationEntity } from "./conversation.entity";
import { GroupChatEntity } from "src/groupchat/entities/groupchat.entity";
//import { GroupChatEntity } from "src/groupchat/entities/groupchat.entity"

@Entity("Participant")
export class ParticipantEntity extends AbstractBaseEntity{

    @ManyToOne(()=> AccountEntity, account => account.id)
    @Column()
    accountId : string

    @Column({default : "pharmaceutical"})
    sectorId : string

    @Column({nullable: true})
    accountName : string

    @Column({nullable: true})
    accountType : string

    @Column({nullable: true})
    accountImage : string

   //@ManyToOne(()=> GroupChatEntity, groupchat => groupchat.id, { onDelete: 'CASCADE'})
    @Column({nullable : true})
    groupChatID : string

    @Column({default : true})
    canPost : boolean

    @ManyToOne(() => ConversationEntity, u => u.participants)
    conversation: ConversationEntity;

    @Column('uuid')
    conversationId : string
}