/* eslint-disable prettier/prettier */
import { IsEmail } from "class-validator";
import { EventEntity } from "src/events/event/entities/event.entity";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('eventuser')
export class EventUserEntity extends AbstractBaseEntity{

    @Column({type: "varchar", length: 128})
    name: string;

    @Column({type: "varchar", length: 128})
    phoneNumber: string;

    @Column({type: "varchar", length: 128})
    accessCode: string;
    
    @IsEmail()
    @Column({ length: 128 })
    email: string;

    @Column({ type: 'bool', default: false })
    paid: boolean

    @ManyToOne(() => EventEntity, s => s.eventuser)
    event: EventEntity;

    @Column('uuid')
    eventId: string;


}
