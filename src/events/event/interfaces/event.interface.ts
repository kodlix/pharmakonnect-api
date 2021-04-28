/* eslint-disable prettier/prettier */

export interface EventRO {
    id: string;
    accountId: string;
    name: string;
    description: string;
    numberOfParticipants: number;
    startDate: Date;
    endDate: Date;
    startTime: Date;
    endTime: Date;
    venue: string;
    accessCode: string;
    organizerName: string;
    organizerPhoneNumber: string;
    url: string;
    eventType: string;
    online: boolean;
    free: boolean;
    active: boolean;
    requireUniqueAccessCode: boolean;
    requireRegistration: boolean;
    published: boolean;

}
  