import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AccountRepository } from "./accountRepository";
import { AccountEntity } from "./entities/account.entity";
import { JwtPayload } from "./interfaces/user.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
   @InjectRepository(AccountRepository)
   private readonly accountRepository: AccountRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'ABCDabdc1234',
    });
  }

  async validate(payload: JwtPayload): Promise<AccountEntity> {
    const { email } = payload;
    const user = await this.accountRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}