/* eslint-disable prettier/prettier */

export interface EventRO {
    id: string;
    accountId: string;
    name: string;
    description: string;
    numberOfParticipants: number;
    startDate: Date;
    endDate: Date;
    venue: string;
    accessCode: string;
    organizer: string;
    organizerPhoneNo: string;
    url: string;
    eventType: string;
    online: boolean;
    free: boolean;
    active: boolean;
    requireAccessCode: boolean;
    requireUniqueAccessCode: boolean;
    requireRegistration: boolean;
    published: boolean;

}
  