import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AccountRepository } from './account.repository';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'ABCDabdc1234',
      signOptions: {
        expiresIn: 86400,
      },
    }),
    TypeOrmModule.forFeature([AccountRepository])
  ],
  controllers: [AccountController],
  providers: [AccountService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, AccountService]
})
export class AccountModule { }
