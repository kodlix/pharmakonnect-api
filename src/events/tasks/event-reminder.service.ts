
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression  } from '@nestjs/schedule';
import { Connection } from 'typeorm';
import * as SendGrid from "@sendgrid/mail";
import { EventRepository } from '../event/event.repository';
SendGrid.setApiKey("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")


@Injectable()
export class EventReminderService {
    
    private readonly logger = new Logger(EventReminderService.name);
    private  eventRepo: EventRepository;

    constructor(private readonly connection: Connection) {
      this.eventRepo = this.connection.getCustomRepository(EventRepository);
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleEventReminder() {
      
      const messages = [];
      let msg: any = {};

      const start = new Date();
      //start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() + 1)


      const end = new Date(start);



      const futureEvents = await this.eventRepo.createQueryBuilder('ev')
                          .select('id')
                          .addSelect('ev.startTime', 'startTime')
                          .addSelect('ev.startDate', 'startDate')
                          .addSelect('ev.eventReminderSent', 'eventReminderSent')
                          .where(`ev.startDate BETWEEN '${start.toISOString()}' AND '${end.toISOString()}'`)
                          .andWhere("ev.eventReminderSent = false")
                          .getRawMany();

      if(futureEvents.length > 0) {

          for (const tm of futureEvents) {
            tm.startTime = tm.startTime.split(':')[0] >= 12 ? `${tm.startTime} PM` : `${tm.startTime} AM`;

             if(tm.eventUsers.length > 0) {

                  for (const evUsers of tm.eventUsers) {
                    msg.to = evUsers.email;
                    msg.from = 'Kaapsule <zack.aminu@netopconsult.com>';
                    msg.subject = `Reminder email for your upcoming event`,
                    msg.html = `<p> Dear ${evUsers.name}, </p>
                        <p> Please be reminded that, the event <strong>${tm.name}</strong> you registered for, </p>
                        <p>starts on <strong>${evUsers.startDate}</strong> at <strong>${tm.startTime}</strong>.</p>
                        <p> Thank you for choosing <strong> Kaapsule. </strong></p>`

                    messages.push(msg);
                    msg = {};
                }
             }
          }

          try {
            if(messages.length > 0) {
                const sent = await SendGrid.send(messages);
                if(sent) {
                    for (const e of futureEvents) {
                        e.eventReminderSent = true;
                        await this.eventRepo.save(e)
                    }
                }
            }


        } catch (error) {
            console.log(`error while sending reminder - ${error}`);
            Logger.log(`error while sending reminder - ${error}`);
        }
      }

      // console.log("f", futureEvents);
      //this.logger.debug('Called when the current second is 45');
    }
}