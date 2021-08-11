import { Column, Entity, ManyToOne, CreateDateColumn } from "typeorm";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { AccountEntity } from "src/account/entities/account.entity"
import { GroupChatEntity } from "src/groupchat/entities/groupchat.entity"
import { ConversationEntity } from "src/chat/entities/conversation.entity"
import { text } from "express";

@Entity("Message")
export class MessageEntity extends AbstractBaseEntity{

   //@ManyToOne(()=> GroupChatEntity, groupchat => groupchat.id, { onDelete: 'CASCADE'})
   
    @Column({nullable : true})
    groupChatID : string

    @ManyToOne(() => ConversationEntity, u => u.messages)
    conversation: ConversationEntity;

    @Column('uuid')
    conversationId : string

    @ManyToOne(()=> AccountEntity, account => account.id)
    @Column()
    senderId : string

    @ManyToOne(()=> AccountEntity, account => account.id)
    @Column({nullable: true})
    recieverId : string

    @Column({default : "pharmaceutical"})
    sectorId : string

    @Column({nullable : true})
    imageURL : string
    
    @Column({nullable : true})
    audioURL : string

    @Column({nullable : true})
    videoURL : string
    
    @Column("text")
    message : string

    @Column({type: 'bool', default: false})
    read : boolean;

    @Column({default: false})
    deleteFromSender : boolean

    @Column({default: false})
    deleteFromAll : boolean

    @CreateDateColumn({ name: 'postedOn', default: new Date() })
    postedOn: Date

    // @Column("simple-array", {nullable: true})
    // groupMembersId : string[]


}
