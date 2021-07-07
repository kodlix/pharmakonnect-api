import { CorperateDTO } from './dto/cooperate.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IndividualDTO } from './dto/individual.dto';
import { RegisterDTO, LoginDTO, LockUserDTO, ResetPasswordDto, ChangePasswordDto } from './dto/credential.dto';
import { CorperateRO, IndividualRO, UserRO } from './interfaces/account.interface';
import { JwtPayload, OrganizationRO, UserDataRO } from './interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { AccountRepository } from './account.repository';
import { FilterDto } from 'src/_common/filter.dto';
import { getRepository, Not } from 'typeorm';
import { AccountEntity } from './entities/account.entity';
import { SendGridService } from 'src/mailer/sendgrid.service';
import { accountTypes } from './account.constant';
import { ContactEnitiy } from 'src/contact/entities/contact.entity';


@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private jwtService: JwtService,
    private readonly mailService: SendGridService,
  ) { }

  public async login(loginDto: LoginDTO): Promise<UserRO> {
    const user = await this.accountRepository.validateUserPassword(loginDto);
    if (!user) {
      throw new HttpException({ error: `Invalid email or password` }, HttpStatus.BAD_REQUEST);
    }
    
    const { email, accountPackage, isRegComplete, accountType, accountId, profileImage } = user
    if (!email) {
      throw new HttpException({ error: `Invalid email or password` }, HttpStatus.UNAUTHORIZED);
    }

    if (!user.verified) {
      throw new HttpException({ error: `emailNotVerified`, type: 'emailNotVerified' }, HttpStatus.UNAUTHORIZED);
    }
    const payload: JwtPayload = { email };
    const accessToken = await this.jwtService.sign(payload);
    let dataToReturn = {
      email, token: accessToken, expires_in: 86400, accountPackage,
      isRegComplete, accountType, accountId, profileImage
    };
    return dataToReturn;
  }

  public async forgetPassword(email: string): Promise<string> {
      if (await this.createEmailToken(email)) {
        await this.sendEmailForgotPassword(email);
      }
      return "Forgot password email sent successfully";
  }

  public async register(registerDto: RegisterDTO): Promise<string> {
    if (await this.accountRepository.register(registerDto)) {
      if (await this.createEmailToken(registerDto.email)) {
        await this.sendEmailVerification(registerDto.email);
      }
      return "Registration successfully";
    }
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


  public async getAvailableContactsByAccount(search, page = 1, take = 20, user: any): Promise<UserDataRO[]> {
    page = +page;
    take = take && +take || 20;

    const contacts = await getRepository(ContactEnitiy)
      .createQueryBuilder('contact')
      .where('contact.creatorId = :id', { id: user.id })
      .select('contact.accountId')
      .getMany();

    let contactIds = [user.id, ...contacts.map(c => c.accountId)];

    if (search) {
      const searchQuery = `
         account.firstName like :firstName OR 
         account.lastName like :lastName`;

      //  const searchQuery = `
      //  account.city like :city OR 
      //  account.organizationName like :organizationName OR
      //   account.email like :email OR account.phoneNumber like :phoneNumber OR
      //   account.pcn like :pcn OR
      //   account.firstName like :firstName OR 
      //   account.lastName like :lastName OR
      //   account.typeOFPractice like :typeOfPractice OR
      //   account.organizationType like :organizationType OR
      //   account.companyRegistrationNumber like :companyRegistrationNumber OR
      //   account.address like :address OR
      //   account._state.name like :state OR
      //   account._lga.name like :lga OR
      //   account._country.name like :country`;

      const accts = await getRepository(AccountEntity)
        .createQueryBuilder('account')
        .where('account.isRegComplete = :status', { status: true })
        .andWhere('account.accountType Not In (:...types)', {
          types:
            [accountTypes.CORPORATE, accountTypes.DEVELOPER, accountTypes.ADMIN]
        })
        .andWhere('account.id Not In (:...contacts)', { contacts: contactIds })
        .andWhere(searchQuery, {
          firstName: `%${search}%`,
          lastName: `%${search}%`
        })
        .skip(take * (page - 1))
        .take(take)
        .orderBy('account.createdAt', 'DESC')
        .getMany();

      return this.accountRepository.buildUserArrRO(accts);
    }


    const accounts = await getRepository(AccountEntity)
      .createQueryBuilder('account')
      .where('account.isRegComplete = :status', { status: true })
      .andWhere('account.accountType Not In (:...types)', {
        types:
          [accountTypes.CORPORATE, accountTypes.DEVELOPER, accountTypes.ADMIN]
      })
      .andWhere('account.id Not In (:...contacts)', { contacts: contactIds })
      .skip(take * (page - 1))
      .take(take)
      .orderBy('account.createdAt', 'DESC')
      .getMany();
    return this.accountRepository.buildUserArrRO(accounts);
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

  public async findUnverifedStaff(id:string, page){
    return await this.accountRepository.findUnverifedStaff(id,page);
  }

  public async findVerifiedStaff(id:string,page){
    return await this.accountRepository.findVerifedStaff(id,page);

  }

  public async verifyStaff(id: string){
    return await this.accountRepository.verifyStaff(id)
  }

  public async rejectStaff(id: string,message: string){
    return await this.accountRepository.rejectStaff(id,message)
  }

  public async updateCorperate(email: string, toUpdate: CorperateDTO): Promise<CorperateRO> {
    toUpdate.isRegComplete = true;
    const orgName = toUpdate.organizationName;
    const account = await this.accountRepository.findOne({ where: { organizationName: orgName, id: Not(toUpdate.id) } });
    if (account) {
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


  async updateProfileImage(filename: string, userId: string) {
    return await this.accountRepository.updateProfileImage(filename, userId);
  }

  public async verifyEmail(token: string): Promise<string> {
    try {
      let user = await this.accountRepository.findOne({ where: { emailToken: token } });
      if (user && user.email) {
        user.emailVerified = true;
        user.updatedAt = new Date();
        user.updatedBy = user.email;
        await user.save();
        return "Email verified successfully";
      } else {
        throw new HttpException(
          { error: `Unable to verify user email, Kindly retry.`, status: HttpStatus.BAD_REQUEST },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        { error: `An error occurred while trying to send verify email`, status: HttpStatus.INTERNAL_SERVER_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async createEmailToken(email: string): Promise<boolean> {
    let user = await this.accountRepository.findOne({ where: { email: email } });
    if (!user) return false;
    user.emailToken = (Math.floor(Math.random() * (9000000)) + 1000000).toString();
    user.updatedAt = new Date();
    user.updatedBy = user.email;
    await user.save();
    return true;
  }

  public async sendEmailVerification(email: string): Promise<boolean> {
    let model = await this.accountRepository.findOne({ where: { email: email } });
    if (model && model.emailToken) {
      const envUrl = process.env.NODE_ENV === "development" ? process.env.URL_DEV : process.env.URL_PROD;
      const url = `${envUrl}/account/verify/${model.emailToken}`;
      const to = model.email;
      const subject = 'Email Confirmation';
      const html = `<p> Hello <strong>${model.firstName || model.organizationName}</strong>,</p>
      <p> Thanks for getting started with <strong>Kapsuul!</strong> We need a little more information to complete your registration, including confirmation of your email address. <br>
      Click below to confirm your email address: 
      <br/> <a href=${url}>Click here</a></p>
      <p> If you have problems, please paste the above URL into the browser. </p> 
      <p> Thank you for choosing <strong> Kapsuul. </strong></p>`;

      try {
        await this.mailService.sendHtmlMailAsync(to, subject, html);
        return true;
      } catch (error) {
        throw new HttpException(
          { error: `An error occurred while trying to send verify email ${error}`, status: HttpStatus.INTERNAL_SERVER_ERROR },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }else{
      throw new HttpException(
        { error: `Unable to send verification email. Try again later.`, status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async sendEmailForgotPassword(email: string): Promise<any> {
    var model = await this.accountRepository.findOne({ where: { email: email } });
    if (!model) throw new HttpException(`Account does not exists`, HttpStatus.NOT_FOUND);

    if (!model.emailToken) throw new HttpException(`Invalid token`, HttpStatus.NOT_FOUND);

    const envUrl = process.env.NODE_ENV === "development" ? process.env.WEB_URL_DEV: process.env.WEB_URL_PROD;
    const url = `${envUrl}/reset-password?email=${email}&token=${model.emailToken}`;
    
    const to = model.email;
    const subject = 'Forget Password Request';
    const html = `<p> Hello <strong>${model.firstName || model.organizationName}</strong>,</p>
        <p> We're sending you this email because you requested a password reset. Click on this link to create a new password: <br>
        <br/> <a href=${url}>Click here</a></p>
        <p> If you didn't request a password reset, you can ignore this email. Your password will not be changed.</p>
        <p> Thank you for choosing <strong> Kapsuul. </strong></p>`;

        try {
          await this.mailService.sendHtmlMailAsync(to, subject, html);
        return true;
        } catch (error) {
          throw new HttpException(
            { error: `An error occurred while trying to send verify email ${error}`, status: HttpStatus.INTERNAL_SERVER_ERROR },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
  }


  public async setNewPassord(resetDto: ResetPasswordDto): Promise<string> {
    return await this.accountRepository.setNewPassord(resetDto);
  }

  public async changedPassword(changeDto: ChangePasswordDto): Promise<string> {
    return await this.accountRepository.changedPassword(changeDto);
  }

  public async getOneUserByEmail(email: string): Promise<AccountEntity> {
    return await this.accountRepository.findOneOrFail({ where: { email } });
  }

  public async getOneUserById(id: string): Promise<AccountEntity> {
    return await this.accountRepository.findOneOrFail({ where: { id } });
  }
}
