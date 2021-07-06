import { LgaModule } from './../lga/lga.module';
import { StateModule } from './../state/state.module';
import { CountryModule } from './../country/country.module';
import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { AccountModule } from 'src/account/account.module';
import { NotificationtypeModule } from 'src/notifications/notificationtype/notificationtype.module';
@Module({
  imports: [CountryModule, StateModule, NotificationtypeModule, LgaModule, AccountModule],
  controllers: [],
  providers: [SeederService]
})
export class SeederModule {}
