import { Column, Entity, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { ParticipantEntity } from "./participant.entity";
import { MessageEntity } from "./message.entity";

@Entity("Conversation")
export class ConversationEntity extends AbstractBaseEntity {

    @Column()
    title : string

    
    @Column()
    creatorId : string

    
    @Column()
    channelId : string

    @Column({default : false})
    isGroupChat : boolean

    @Column()
    updatedOn : Date

    @Column({nullable: true})
    creatorName : string

    
    @Column({nullable: true})
    channelName : string

    @Column({nullable: true})
    initiatorId : string

    @OneToMany(() => ParticipantEntity, participant => participant.conversationid, {eager: true,  cascade: true})
   // @JoinColumn()
    participants : ParticipantEntity[]

    @OneToMany(() => MessageEntity, message => message.conversationId, {eager: true, cascade: true})
    //@JoinColumn()
    messages : MessageEntity[]

}
