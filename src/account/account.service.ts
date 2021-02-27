import { CorperateDTO } from './dto/cooperate.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IndividualDTO } from './dto/individual.dto';
import { RegisterDTO, LoginDTO, LockUserDTO } from './dto/credential.dto';
import { CorperateRO, IndividualRO, UserRO } from './interfaces/account.interface';
import { JwtPayload, OrganizationRO, UserDataRO } from './interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { AccountRepository } from './account.repository';
import { FilterDto } from 'src/_common/filter.dto';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private jwtService: JwtService,
  ) { }

  public async login(loginDto: LoginDTO): Promise<UserRO> {
    const user = await this.accountRepository.validateUserPassword(loginDto);
    if (!user) {
      throw new HttpException({ error: `Invalid email or password` }, HttpStatus.BAD_REQUEST);
    }
    const { email, accountPackage, isRegComplete, accountType } = user
    if (!email) {
      throw new HttpException({ error: `Invalid email or password` }, HttpStatus.UNAUTHORIZED);
    }
    const payload: JwtPayload = { email };
    const accessToken = await this.jwtService.sign(payload);
    let dataToReturn = {
      email, token: accessToken, expires_in: 86400, accountPackage,
      isRegComplete, accountType
    };
    return dataToReturn;
  }

  public async register(registerDto: RegisterDTO): Promise<string> {
    return this.accountRepository.register(registerDto);
  }

  public async findAll({ search }: FilterDto): Promise<UserDataRO[]> {
    const query = this.accountRepository.createQueryBuilder('account');
    if (search) {
      query.andWhere('(account.firstName LIKE :search OR account.lastName LIKE :search OR account.organizationName LIKE :search)',
        { search: `%${search}%` });
    }
    const users = await query.getMany();
    return this.accountRepository.buildUserArrRO(users);
  }

  public async findOne(id: string): Promise<UserDataRO> {
    return await this.accountRepository.getById(id);
  }

  public async findByEmail(email: string): Promise<UserDataRO> {
    return await this.accountRepository.findByEmail(email);
  }

  public async updateIndividual(email: string, toUpdate: IndividualDTO): Promise<IndividualRO> {
    toUpdate.isRegComplete = true;
    return await this.accountRepository.updateUser(email, toUpdate);
  }

  public async updateCorperate(email: string, toUpdate: CorperateDTO): Promise<CorperateRO> {
    toUpdate.isRegComplete = true;
    const orgName = toUpdate.organizationName;
    const account = await this.accountRepository.createQueryBuilder("account")
     .where("LOWER(account.organizationName) = LOWER(:orgName)", { orgName }).getMany();
    if (account.length > 0) {
      throw new HttpException({
        error: `${orgName} already exists`, status: HttpStatus.NOT_FOUND
      }, HttpStatus.NOT_FOUND);
    }
    return await this.accountRepository.updateUser(email, toUpdate);
  }

  public async lockAndUnlockUser(lockUserDto: LockUserDTO): Promise<UserDataRO> {
    return await this.accountRepository.lockAndUnlockUser(lockUserDto);
  }

  public async find(): Promise<UserDataRO[]> {
    const users = await this.accountRepository.find();
    return this.accountRepository.buildUserArrRO(users);
  }

  public async findOrg(): Promise<OrganizationRO[]> {
    return await this.accountRepository.findOrg();
  }

}
