import { Column, Entity, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { ParticipantEntity } from "./participant.entity";
import { MessageEntity } from "./message.entity";

@Entity("Conversation")
export class ConversationEntity extends AbstractBaseEntity {

    @Column({nullable: true})
    title : string
    
    @Column({nullable: true})
    creatorId : string
    
    @Column({nullable: true})
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
    message : string

    @Column()
    initiatorId : string;

    @Column()
    counterPartyId : string;

    @Column()
    initiatorName : string;

    @Column()
    counterPartyName : string;

    @Column({nullable: true})
    counterPartyImage : string;

    @Column({nullable: true})
    initiatorImage : string;


    @OneToMany(() => ParticipantEntity, participant => participant.conversation, {eager: true,  cascade: true})
    participants : ParticipantEntity[]

    @OneToMany(() => MessageEntity, t => t.conversation, {eager: true, cascade: true})
    messages : MessageEntity[]


}
