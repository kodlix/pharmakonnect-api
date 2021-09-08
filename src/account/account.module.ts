import { forwardRef, Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AccountRepository } from './account.repository';
import { default as config } from './config';
import { MailerModule } from 'src/mailer/mailer.module';
import { GroupModule } from 'src/group/group.module';
import { StateModule } from 'src/state/state.module';
import { CountryModule } from 'src/country/country.module';
import { LgaModule } from 'src/lga/lga.module';

@Module({
  imports: [
    MailerModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: config.jwt.secretOrKey,
      signOptions: {
        expiresIn: config.jwt.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([AccountRepository]),
    forwardRef(() => GroupModule),
    forwardRef(() => StateModule),
    forwardRef(() => CountryModule),
    forwardRef(() => LgaModule)
  ],
  controllers: [AccountController],
  providers: [AccountService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, AccountService]
})
export class AccountModule { }
