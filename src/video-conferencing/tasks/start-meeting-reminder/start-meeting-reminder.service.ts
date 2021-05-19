
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression  } from '@nestjs/schedule';
import { ScheduleMeetingRepository } from 'src/video-conferencing/schedule-meetings/schedule-meeting.repository';
import { Connection } from 'typeorm';
import * as SendGrid from "@sendgrid/mail";
import { isNotValidTime } from 'src/_utility/time-validator.util';
SendGrid.setApiKey("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")


@Injectable()
export class StartMeetingReminderService {
    
    private readonly logger = new Logger(StartMeetingReminderService.name);
    private  scheduleMeetingRepo: ScheduleMeetingRepository;

    constructor(private readonly connection: Connection) {
      this.scheduleMeetingRepo = this.connection.getCustomRepository(ScheduleMeetingRepository);
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async handleStartMeetingReminder() {

          const meetingStartTimeReached = [];
          const messages = [];
          let msg: any = {};

          const start = new Date();
            start.setHours(0, 0, 0, 0);
            const end = new Date(start);
            end.setDate(start.getDate() + 1);

          const todayMeetings = await this.scheduleMeetingRepo.createQueryBuilder('meet')
                              .select('id')
                              .addSelect('meet.startTime', 'startTime')
                              .addSelect('meet.startDate', 'startDate')
                              .addSelect('meet.schedulerEmail', 'schedulerEmail')
                              .addSelect('meet.meetingReminderSent', 'meetingReminderSent')
                              .addSelect('meet.schedulerName', 'schedulerName')
                              .where(`meet.startDate BETWEEN '${start.toISOString()}' AND '${end.toISOString()}'`)
                              .andWhere("meet.meetingStarted = false")
                              .andWhere("meet.meetingReminderSent = false")
                              .getRawMany();

          if(todayMeetings.length > 0) {

              for (const tm of todayMeetings) {

                if (isNotValidTime(tm.startTime, tm.startDate)) {
                    meetingStartTimeReached.push(tm);
                }

              }

              if(meetingStartTimeReached.length > 0)  {
                    for (const msr of meetingStartTimeReached) {

                      msr.startTime = msr.startTime.split(':')[0] >= 12 ? `${msr.startTime} PM` : `${msr.startTime} AM`;

                      msg.to = msr.schedulerEmail;
                      msg.from = 'Kaapsule <zack.aminu@netopconsult.com>';
                      msg.subject = `Reminder to Start your scheduled meeting`,
                      msg.html = `<p> Dear ${msr.schedulerName}, </p>
                          <p> Due to your busy schedule, this is a reminder email for you to Start the meeting you scheduled for <strong>${msr.startDate}</strong> at <strong>${msr.startTime}</strong>.</p>
                          <p> Please login to your account and proceed to start meeting.</p>
                          <p> Thank you for choosing <strong> Kaapsul. </strong></p>`

                      messages.push(msg);
                      msg = {};

                    }
                }

                try {
                  if(messages.length > 0) {
                      const sent = await SendGrid.send(messages);
                      if(sent) {
                          for (const e of meetingStartTimeReached) {
                              e.meetingReminderSent = true;
                              await this.scheduleMeetingRepo.save(e)
                          }
                      }
                  }


              } catch (error) {
                  console.log(`error while sending reminder - ${error}`);
                  Logger.log(`error while sending reminder - ${error}`);
              }
          }

          // console.log("m", todayMeetings);
          //this.logger.debug('Called when the current second is 45');
    }
}