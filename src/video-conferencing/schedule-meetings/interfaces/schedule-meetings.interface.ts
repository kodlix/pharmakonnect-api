/* eslint-disable prettier/prettier */

export interface ScheduleMeetingsRO {
    id: string;
    accountId: string;
    topic: string;
    description: string;
    duration: string;
    startDate: Date;
    passcode: string;
    meetingID: string;
    waitingRoom: boolean;
    hostVideo: boolean;
    participantVideo : boolean;
    meetingEnded: boolean;
    meetingStarted: boolean;
    muteParticipantOnEntry: boolean;
    recordMeeting: boolean;
    allowParticipantJoinAnytime: boolean;
}
  