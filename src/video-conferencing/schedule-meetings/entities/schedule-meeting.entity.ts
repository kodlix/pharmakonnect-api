/* eslint-disable prettier/prettier */
import { AccountEntity } from "src/account/entities/account.entity";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('Meetings')
export class ScheduleMeetingEntity extends AbstractBaseEntity{

    @Column({ type: "varchar", length: 128})
    topic: string;

    @Column({type: "varchar", length: 128})
    description: string;

    @Column({type: 'varchar'})
    duration: string;

    @Column({ name: 'startDate', default: new Date()})
    startDate: Date;

    @Column({ type: "varchar", length: 128})
    meetingID: string;

    @Column({type: "varchar", length: 128})
    passcode: string;

    @Column({ type: 'bool', default: false })
    waitingRoom: boolean

    @Column({ type: 'bool', default: true})
    hostVideo: boolean;

    @Column({ type: 'bool', default: true})
    participantVideo: boolean;

    @Column({ type: 'bool', default: false})
    meetingStarted: boolean;

    @Column({ type: 'bool', default: false})
    meetingEnded: boolean;

    @ManyToOne(() => AccountEntity, s => s.meeting)
    account: AccountEntity;

    @Column('uuid')
    accountId: string;
}
