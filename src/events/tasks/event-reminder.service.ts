
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

    // @Cron(CronExpression.EVERY_5_MINUTES)
    // async handleEventReminder() {

    // }
}