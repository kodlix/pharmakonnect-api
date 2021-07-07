import { NotificationEntity } from "src/notifications/notification/entities/notification.entity";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";

@Entity('NotificationType')
export class NotificationTypeEntity extends AbstractBaseEntity{

    @Column({type: "varchar", length: 128})
    name: string;

    @Column({type: "varchar", length: 128})
    description: string;

    @OneToMany(() => NotificationEntity, notification => notification.notificationType)
    notification: NotificationEntity;

}


