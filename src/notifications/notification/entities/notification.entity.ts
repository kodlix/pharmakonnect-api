import { Exclude } from "class-transformer";
import { AccountEntity } from "src/account/entities/account.entity";
import { NotificationTypeEntity } from "src/notifications/notificationtype/entities/notificationtype.entity";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

@Entity('Notification')
export class NotificationEntity extends AbstractBaseEntity{

    @Column({type: "varchar", length: 128})
    message: string;

    @Column({type: "varchar", nullable: true, length: 128})
    url: string;

    @Column({ type: 'bool', default: false})
    deleted: boolean;

    @Column({ type: 'bool', default: false})
    isGeneral: boolean;

    @ManyToOne(() => AccountEntity, s => s.meeting)
    account: AccountEntity;

    @Column('uuid')
    accountId: string;

    @Column('uuid')
    recieverId: string;

    @Column('uuid')
    senderId: string;

    @Exclude()
    @Column({ type: 'bool', default: false})
    seen: boolean;

    @OneToOne(() => NotificationTypeEntity, notificationType => notificationType.notification)
    @JoinColumn()
    notificationType: NotificationTypeEntity
}
