import { Exclude } from "class-transformer";
import { AccountEntity } from "src/account/entities/account.entity";
import { NotificationTypeEntity } from "src/notifications/notificationtype/entities/notificationtype.entity";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity('Notification')
export class NotificationEntity extends AbstractBaseEntity{

    @Column({type: "varchar", length: 512})
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

    @Column('uuid', {nullable: true})
    entityId: string;

    @Column('uuid')
    recieverId: string;

    @Column('uuid')
    senderId: string;

    @Exclude()
    @Column({ type: 'bool', default: false})
    seen: boolean;

    @ManyToOne(() => NotificationTypeEntity, notificationType => notificationType.notification, {onDelete: 'CASCADE'})
    @JoinColumn()
    notificationType: NotificationTypeEntity;

    @Column({ nullable: true })
    senderImageUrl: string;
}
