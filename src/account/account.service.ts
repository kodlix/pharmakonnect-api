import { CorperateDTO } from './dto/cooperate.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IndividualDTO } from './dto/individual.dto';
import { RegisterDTO, LoginDTO, LockUserDTO, ResetPasswordDto, ChangePasswordDto } from './dto/credential.dto';
import { CorperateRO, IndividualRO, UserRO } from './interfaces/account.interface';
import { JwtPayload, OrganizationRO, UserDataRO } from './interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { AccountRepository } from './account.repository';
import { FilterDto } from 'src/_common/filter.dto';
import { Not } from 'typeorm';
import * as nodemailer from 'nodemailer';
import * as SendGrid from "@sendgrid/mail";
import { default as config } from './config';
import { AccountEntity } from './entities/account.entity';
SendGrid.setApiKey("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");


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
    const { email, accountPackage, isRegComplete, accountType, accountId, profileImage} = user
    if (!email) {
      throw new HttpException({ error: `Invalid email or password` }, HttpStatus.UNAUTHORIZED);
    }
    const payload: JwtPayload = { email };
    const accessToken = await this.jwtService.sign(payload);
    let dataToReturn = {
      email, token: accessToken, expires_in: 86400, accountPackage,
      isRegComplete, accountType, accountId, profileImage
    };
    return dataToReturn;
  }

  public async register(registerDto: RegisterDTO): Promise<string> {
    if (await this.accountRepository.register(registerDto)) {
      // if (await this.createEmailToken(registerDto.email)) {
      //   await this.sendEmailVerification(registerDto.email);
      // }
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
        const to = model.email;
        const from = 'zack.aminu@netopconsult.com';
        const subject = 'Email Confirmation';
        const html = `<p> Hello ${model.firstName} ${model.lastName},</p><br>
            <p> Thanks for getting started with <strong>Pharma Konnect!</strong> We need a little more information to complete your registration, including confirmation of your email address. Click below to confirm your email address: 
            <a href='${config.host.url}:${config.host.port}/auth/verify/${model.emailToken}'>Click here</a></p><br>
            <p> If you have problems, please paste the above URL into the browser. </p> <br><br>
            <p> Thank you for choosing <strong> Pharma Konnect. </strong></p>`;

      try {
        let isEmailSent = await this.sendEmailAsync(to, from, subject, html);
        if (isEmailSent) {
          return true;
        } else {
          throw new HttpException(
            { error: `Unable to send verification email`, status: HttpStatus.BAD_REQUEST },
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
  }

  public async sendEmailForgotPassword(email: string): Promise<string> {
    var model = await this.accountRepository.findOne({ where: { email: email } });
    if (!model) throw new HttpException(`${email} does not exists`, HttpStatus.NOT_FOUND);

    const to = model.email;
    const from = 'zack.aminu@netopconsult.com';
    const subject = 'Frogotten Password';
    const html = `<p> Hello ${model.firstName} ${model.lastName}, </p>
        <p> We're sending you this email because you requested a password reset. Click on this link to create a new password: <br><br>
        <a href='${config.host.url}:${config.host.port}/auth/reset-password'>Click here</a></p><br>
        <p> If you didn't request a password reset, you can ignore this email. Your password will not be changed.</p>
        <p> Thank you for choosing <strong> Pharma Konnect. </strong></p>`;

    try {
      let emailSent = await this.sendEmailAsync(to, from, subject, html);
      if (emailSent) {
        return "Email for forget password successfully sent";
      } else {
        throw new HttpException(
          { error: `Unable to send verification email`, status: HttpStatus.BAD_REQUEST },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        { error: `${error}`, status: HttpStatus.INTERNAL_SERVER_ERROR },
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

  private async sendEmailAsync(email: string, from: string, subject: string, html: any) {
    const messages = [];
    let msg: any = {};

    msg.to = email;
    msg.from = from;
    msg.subject = subject,
      msg.html = html

    messages.push(msg);
    msg = {};

    if (messages.length > 0) {
      const sent = await SendGrid.send(messages);
      return sent;
    }
  }

  public async getOneUserByEmail(email: string): Promise<AccountEntity> {
    return await this.accountRepository.findOneOrFail({ where: { email } });
  }

  public async getOneUserById(id: string): Promise<AccountEntity> {
    return await this.accountRepository.findOneOrFail({ where: { id } });
  }
}
