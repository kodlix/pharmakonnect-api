import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractBaseEntity } from "src/_common/base.entity";

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

}
