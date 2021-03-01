import { Column, Entity, OneToMany, ManyToOne } from "typeorm";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { AccountEntity } from "src/account/entities/account.entity"
import { ParticipantEntity } from "src/chat/entities/participant.entity";
import { MessageEntity } from "src/chat/entities/message.entity";

@Entity("GroupChat")
export class GroupChatEntity extends AbstractBaseEntity{

    @ManyToOne(()=> AccountEntity, account => account.id)
    @Column()
    creatorId : string

    @Column({default : "pharmaceutical"})
    sectorId : string

    @Column()
    name : string

    @Column()
    description : string

    @Column({default : false})
    onlyAdminCanPost : boolean

    @Column({default : false})
    isActive : boolean

    @Column()
    activateOn : Date

    @Column()
    expiresOn : Date


    @OneToMany(() => ParticipantEntity, participant => participant.groupChatID, {eager: true,  cascade: true})
    participants : ParticipantEntity[]

    @OneToMany(() => MessageEntity, message => message.groupChatID, {eager: true, cascade: true})
    messages : MessageEntity[]



}