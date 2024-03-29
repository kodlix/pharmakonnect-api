/* eslint-disable prettier/prettier */
import { Exclude } from "class-transformer";
import { AccountEntity } from "src/account/entities/account.entity";
import { EventUsersEntity } from "src/events/eventusers/entities/eventusers.entity";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity('Event')
export class EventEntity extends AbstractBaseEntity{

    @Column({unique: true, type: "varchar", length: 128})
    name: string;

    @Column({type: "varchar", length: 128})
    description: string;

    @Column({type: 'int'})
    numberOfParticipants: number;

    @Column({ name: 'startDate', default: new Date()})
    startDate: Date;

    @Column({ name: 'endDate', default: new Date()})
    endDate: Date;

    @Column({ type: 'time', name: 'startTime', default: (): string => 'LOCALTIMESTAMP'})
    startTime: Date;

    @Column({ type: 'time', name: 'endTime', default: (): string => 'LOCALTIMESTAMP'})
    endTime: Date;

    @Column({ type: "varchar", length: 128})
    venue: string;

    @Column({ type: "int", nullable: true})
    cost: number;

    @Column({nullable: true})
    coverImage: string;

    @Column({type: "varchar", nullable: true, length: 128})
    accessCode: string;

    @Column({type: "varchar", length: 128})
    organizerName: string;

    @Column({type: "varchar", length: 128})
    organizerPhoneNumber: string;

    @Column({type: "varchar", nullable: true, length: 128})
    url: string;

    @Column({type: "varchar", nullable: true, length: 128})
    rejectionMessage: string;

    @Column({type: "varchar", length: 128})
    eventType: string;

    @Column({ type: 'bool', default: false })
    online: boolean

    @Column({ type: 'bool', default: true })
    free: boolean

    @Column({ type: 'bool', default: true })
    active: boolean

    @Column({ type: 'bool', default: false})
    requireUniqueAccessCode: boolean;

    @Column({ type: 'bool', default: false})
    requireRegistration: boolean;

    @Column({ type: 'bool', default: false})
    published: boolean;

    @Column({ type: 'bool', default: false})
    rejected: boolean;

    @ManyToOne(() => AccountEntity, s => s.meeting)
    account: AccountEntity;

    @Column('uuid')
    accountId: string;

    @OneToMany(() => EventUsersEntity, s => s.event)
    eventUsers: EventUsersEntity[];

    @Exclude()
    @Column({nullable: true})
    publishedOn: Date;

    @Exclude()
    @Column({nullable: true})
    rejectedOn: Date;

    @Exclude()
    @Column({ type: 'bool', default: false})
    eventReminderSent: boolean;


}
