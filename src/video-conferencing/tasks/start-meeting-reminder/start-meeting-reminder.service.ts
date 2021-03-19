
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression  } from '@nestjs/schedule';
import { ScheduleMeetingRepository } from 'src/video-conferencing/schedule-meetings/schedule-meeting.repository';
import { Connection } from 'typeorm';
import * as SendGrid from "@sendgrid/mail";
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
          const msg: any = {};

          const start = new Date();
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
                const todayTime = `${start.getHours()}.${start.getMinutes()}`;

                const splitedStartTime = tm.startTime.toString().split(":");
                const startTime = `${splitedStartTime[0]}.${splitedStartTime[1]}`;

                if(todayTime >= startTime) {
                    meetingStartTimeReached.push(tm);
                }

              }

              if(meetingStartTimeReached.length > 0)  {
                    for (const msr of meetingStartTimeReached) {

                      msg.to = msr.schedulerEmail;
                      msg.from = 'zack.aminu@netopconsult.com';
                      msg.subject = `Reminder to Start your scheduled meeting`,
                      msg.html = `<p> Dear ${msr.schedulerName}, </p>
                          <p> Due to your busy schedule, this is a reminder email for you to Start the meeting you scheduled at <strong>${msr.startTime}</strong> today.</p>
                          <p> Please login to your account and proceed to your meetings to start.</p>
                          <p> Thank you for choosing <strong> Pharma Konnect. </strong></p>`

                      messages.push(msg);

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
              }
          }

          console.log("m", todayMeetings);
          //this.logger.debug('Called when the current second is 45');
    }
}