import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectorModule } from './sector/sector.module';
import { CountryModule } from './country/country.module';
import { StateModule } from './state/state.module';
import { JobVacancyModule } from './jobvacancy/jobvacancy.module';
import { LgaModule } from './lga/lga.module';
import { SeederModule } from './seeder/seeder.module';
import { ChatModule } from './chat/chat.module';
import { ContactModule } from './contact/contact.module';
import { ScheduleMeetingsModule } from './video-conferencing/schedule-meetings/schedule-meetings.module';
import { FlatMeetingModule } from './video-conferencing/events/flat-meeting-gateway/flat-meeting.module';
import { GroupchatModule } from './groupchat/groupchat.module';
import { OutletModule } from './outlet/outlet.module';
import { StartMeetingReminderModule } from './video-conferencing/tasks/start-meeting-reminder/start-meeting-reminder.module';
import { ScheduleMeetingGatewayModule } from './video-conferencing/events/schedule-meeting-gateway/schedule-meeting-gateway.module';
import { ArticleModule } from './blog/article/article.module';
import { CommentModule } from './blog/comment/comment.module';
import { CategoryModule } from './blog/category/category.module';
import { EventsModule } from './events/events.module';
import { EventReminderModule } from './events/tasks/event-reminder.module';
import { PollModule } from './poll/poll.module';
import { FeatureModule } from './features/feature.module';
import { MailerModule } from './mailer/mailer.module';
import { LikeModule } from './user-like/like.module';
import { AdvertModule } from './advert/advert/advert.module';
import { AdvertCategoryModule } from './advert/advertcategory/advertcategory.module';
import { join } from 'path';
import { NotificationModule } from './notifications/notification/notification.module';
import { NotificationtypeModule } from './notifications/notificationtype/notificationtype.module';
import { GroupModule } from './group/group.module';
import { ChatGateway } from './gateway/chat.gateway';
import { NotificationGateway } from './gateway/notification.gateway';
import { DashboardModule } from './dashboard/dashboard.module';
import { ModuleModule } from './module/module.module';
import { ResourceTypeModule } from './resource-type/resource-type.module';
import { TypeOfPracticeModule } from './type-of-practice/type-of-practice.module';
import { SchoolModule } from './school/school.module';
import { AdvertZoneModule } from './advert/advert-zone/advert-zone.module';
import { OrganizationTypeModule } from './organization-type/organization-type.module';
import { OrganizationCategoryModule } from './organization-category/organization-category.module';
import { ProfessionModule } from './profession/profession.module';
import { ProfessionalGroupModule } from './professional-group/professional-group.module';
import { PackageModule } from './package/package.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),   // <-- path to the static files
    }),
    TypeOrmModule.forRoot({ }),
    AccountModule,
    SectorModule,
    CountryModule,
    StateModule,
    JobVacancyModule,
    LgaModule,
    SeederModule,
    ScheduleMeetingsModule,
    FlatMeetingModule,
    ChatModule,
    ContactModule,
    GroupModule,
    //GroupchatModule,
    OutletModule,
    ScheduleMeetingGatewayModule,
    ScheduleModule.forRoot(),
    StartMeetingReminderModule,
    EventReminderModule,
    ArticleModule,
    CommentModule,
    CategoryModule,
    EventsModule,
    PollModule,
    FeatureModule,
    MailerModule,
    LikeModule,
    AdvertModule,
    AdvertCategoryModule,
    NotificationModule,
    NotificationtypeModule,
    DashboardModule,
    ModuleModule,
    ResourceTypeModule,
    TypeOfPracticeModule,
    SchoolModule,
    AdvertZoneModule,
    OrganizationTypeModule,
    OrganizationCategoryModule,
    ProfessionModule,
    ProfessionalGroupModule,
    PackageModule,

  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, NotificationGateway],
})
export class AppModule { }
