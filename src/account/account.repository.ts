import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AccountEntity } from './entities/account.entity';
import { RegisterDTO, LoginDTO, LockUserDTO, ChangePasswordDto, ResetPasswordDto } from './dto/credential.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserFromDbRO } from './interfaces/account.interface';
import { OrganizationRO, UserDataRO } from './interfaces/user.interface';
import { accountTypes } from './account.constant';
import { constants } from 'buffer';
import { OutletEntity } from 'src/outlet/entity/outlet.entity';

@EntityRepository(AccountEntity)
export class AccountRepository extends Repository<AccountEntity> {
  public async register({
    email,
    password,
    accountType,
    isRegComplete,
    firstName,
    lastName, 
    organizationName
  }: RegisterDTO): Promise<boolean> {
    const isExists = await await this.findOne({ email });
    if (isExists) {
      throw new HttpException(
        { error: `${email} already exists`, status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = new AccountEntity();
    user.email = email;
    user.accountType = accountType;
    user.firstName = firstName;
    user.lastName = lastName;
    user.organizationName = organizationName;
    user.createdBy = email;
    user.accountPackage = 'Free';
    user.isRegComplete = isRegComplete;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    try {
      await user.save();
      if (accountType = "corporate"){

        const outlet = new OutletEntity()
        
        outlet.isHq = true;
        outlet.name = "Headquarters"
        outlet.accountId = user.id;
        outlet.createdBy = user.createdBy;
        outlet.organizationName = user.organizationName;
        await outlet.save()
      }
      return true;
    } catch (error) {
      throw new HttpException(
        { error: `An error occured`, status: HttpStatus.INTERNAL_SERVER_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    
  }

  public async validateUserPassword({
    email,
    password,
  }: LoginDTO): Promise<UserFromDbRO> {
    const user = await await this.findOne({ where: { email: email } });
    if (user && (await user.validatePassword(password))) {
      let data = {
        email,
        accountPackage: user.accountPackage,
        isRegComplete: user.isRegComplete,
        accountType: user.accountType,
        accountId: user.id,
        verified: user.emailVerified,
        profileImage: user.accountType === accountTypes.INDIVIDUAL ? user.profileImage : user.premisesImage
      };
      return data;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  public async getById(id: string): Promise<UserDataRO> {
    const result = await this.findOne(id);
    if (!result) {
      throw new HttpException(
        {
          error: `user with id ${id} does not exists`,
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return this.buildUserRO(result);
  }

  public async findByEmail(email: string): Promise<UserDataRO | undefined> {
    const result = await this.findOne({ where: { email: email } });
    if (!result) {
      throw new HttpException(
        {
          error: `${email} does not exists`,
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return this.buildUserRO(result);
  }

  public async updateUser<T>(
    email: string,
    toUpdate: T,
  ): Promise<UserDataRO | undefined> {
    const user = await this.findOne({ where: { email: email } });
    if (!user) {
      throw new HttpException(
        {
          error: `User with email: ${email} does not exists`,
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const result = await this.merge(user, toUpdate);
    await this.save(user);
    return this.buildUserRO(result);
  }

  public async lockAndUnlockUser({
    email,
    isLocked,
  }: LockUserDTO): Promise<UserDataRO | undefined> {
    const user = await this.findOne({ where: { email: email } });
    if (!user) {
      throw new HttpException(
        {
          error: `User with email: ${email} does not exists`,
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    user.isLocked = isLocked;
    const result = await await user.save();
    return this.buildUserRO(result);
  }

  public async findOrg(): Promise<OrganizationRO[] | undefined> {
    const accType = accountTypes.CORPORATE;
    const account = await this.find({ where: { accountType: accType, isRegComplete: true } });
    return this.buildOrgArrRO(account);
  }

  public async updateProfileImage(filename: string, userId: string) {
    const user = await this.findOne({ id: userId });
    if (!user) {
      throw new HttpException(
        `User does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }   

    user.profileImage = filename;        
    return await user.save();
  }

  public async setNewPassord({ email, password, token }: ResetPasswordDto): Promise<string> {
    try {
      var user = await this.findOne({ where: { email: email, emailToken: token } });
      if (!user) throw new HttpException(`User with email: ${email}, does not exists`, HttpStatus.NOT_FOUND);
      user.password = await this.hashPassword(password, user.salt);
      await user.save();
      return "Password was changed successfully";
    } catch (error) {
      throw new HttpException(
        { error: `An error while try to change password`, status: HttpStatus.INTERNAL_SERVER_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async changedPassword({ email, newPassword, currentPassword }: ChangePasswordDto): Promise<string> {
    try {
      var user = await this.findOne({ where: { email: email } });
      if (!user) throw new HttpException(`User with email: ${email}, does not exists`, HttpStatus.NOT_FOUND);
      if (await user.validatePassword(currentPassword)) {
        user.password = await this.hashPassword(newPassword, user.salt);
        await user.save();
        return "Password was changed successfully";
      }
    } catch (error) {
      throw new HttpException(
        { error: `An error while try to change password`, status: HttpStatus.INTERNAL_SERVER_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private buildUserRO(user: AccountEntity) {
    const userRO = {
      id: user.id,
      pcn: user.pcn,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      isLocked: user.isLocked,
      lastName: user.lastName,
      latitude: user.latitude,
      firstName: user.firstName,
      longitude: user.longitude,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
      accountPackage: user.accountPackage,
      organizationName: user.organizationName,
      organizationType: user.organizationType,
      typesOfPractice: user.typesOfPractice,
      isRegComplete: user.isRegComplete,
      accountType: user.accountType,
      address: user.address,
      country: user.country,
      city: user.city,
      lga: user.lga,
      state: user.state,
      website: user.website,
      openingTime: user.openingTime,
      closingTime: user.closingTime,
      companyRegistrationNumber: user.companyRegistrationNumber,
      yearofEstablishment: user.yearofEstablishment,
      numberofEmployees: user.numberofEmployees
    };
    return userRO;
  }

  public buildUserArrRO(users: AccountEntity[]) {
    let userArr = [];
    users.forEach((user) => {
      userArr.push(this.buildUserRO(user));
    });
    return userArr;
  }

  private buildOrgArrRO(users: AccountEntity[]) {
    let userArr = [];
    users.forEach((user) => {
      const userRO = {
        pcn: user.pcn,
        latitude: user.latitude,
        longitude: user.longitude,
        organizationName: user.organizationName,
        organizationType: user.organizationType,
        companyRegistrationNumber: user.companyRegistrationNumber,
      };
      userArr.push(userRO);
    });
    return userArr;
  }
}
