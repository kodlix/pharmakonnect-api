import { NotificationTypeEntity } from "src/notifications/notificationtype/entities/notificationtype.entity";

export interface NotificationRO {
    message: string,
    senderId: string,
    recieverId: string,
    isGeneral: boolean,
    accountId: string,
    seen: boolean,
    notificationType: NotificationTypeEntity
    createdBy: string;
    entityId: string;
    senderImageUrl: string;
    createdAt : Date;
}