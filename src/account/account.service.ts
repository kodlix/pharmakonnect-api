import { CooperateDTO } from './dto/cooperate.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IndividualDTO } from './dto/individual.dto';
import { RegisterDto, LoginDto } from './dto/auth-credential.dto';
import { CooperateRO, IndividualRO, UserRO } from './interfaces/account.interface';
import { JwtPayload, UserDataRO } from './interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { AccountRepository } from './AccountRepository';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private jwtService: JwtService,
  ) { }

  public async login(loginDto: LoginDto): Promise<UserRO> {
    const email = await this.accountRepository.validateUserPassword(loginDto);
    if (!email) {
      throw new HttpException({message: `Invalid email or password`}, HttpStatus.UNAUTHORIZED);
    }
    const payload: JwtPayload = { email };
    const accessToken = await this.jwtService.sign(payload);
    console.log(`Generated JWT Token with payload ${JSON.stringify(payload)}`);

    let dataToReturn = { email, token: accessToken, expires_in: 86400 };
    return dataToReturn;
  }

  public async register(registerDto: RegisterDto): Promise<string> {
    return this.accountRepository.register(registerDto);
  }

  public async findAll(): Promise<UserDataRO[]> {
    return await this.accountRepository.find();
  }

  public async findOne(id: string): Promise<UserDataRO> {
    return await this.accountRepository.getById(id);
  }

  public async findByEmail(email: string): Promise<UserDataRO> {
    return await this.accountRepository.findByEmail(email);
  }

  public async createIndividual(toCreate: IndividualDTO): Promise<IndividualRO> {
    return await this.accountRepository.save(toCreate);
  }

  public async createCooperate(toCreate: CooperateDTO): Promise<CooperateRO> {
    return await this.accountRepository.save(toCreate);
  }

  public async updateIndividual(id: string, toUpdate: IndividualDTO): Promise<IndividualRO> {
    return await this.accountRepository.updateIndividual(id, toUpdate);
  }

  public async updateCooperate(id: string, toUpdate: CooperateDTO): Promise<CooperateRO> {
    return await this.accountRepository.updateCooperate(id, toUpdate);
  }

}
