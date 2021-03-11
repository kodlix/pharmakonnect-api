/* eslint-disable prettier/prettier */
import { AccountEntity } from "src/account/entities/account.entity";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('Meetings')
export class ScheduleMeetingEntity extends AbstractBaseEntity{

    @Column({unique: true, type: "varchar", length: 128})
    topic: string;

    @Column({type: "varchar", length: 128})
    description: string;

    @Column({type: 'int'})
    durationInHours: number;

    @Column({type: 'int'})
    durationInMinutes: number;

    @Column({ name: 'startDate', default: new Date()})
    startDate: Date;
    
    @Column({ type: 'time', name: 'startTime', default: (): string => 'LOCALTIMESTAMP'})
    startTime: Date;

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

    @Column({ type: 'bool', default: false})
    muteParticipantOnEntry: boolean;

    @Column({ type: 'bool', default: false})
    recordMeeting: boolean;

    @Column({ type: 'bool', default: false})
    allowParticipantJoinAnytime: boolean;
}
