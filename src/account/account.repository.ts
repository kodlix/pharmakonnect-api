import { Brackets, EntityRepository, ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AccountEntity } from './entities/account.entity';
import { RegisterDTO, LoginDTO, LockUserDTO, ChangePasswordDto, ResetPasswordDto } from './dto/credential.dto';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { UserFromDbRO } from './interfaces/account.interface';
import { OrganizationRO, UserDataRO } from './interfaces/user.interface';
import { accountTypes, staffStatus } from './account.constant';
import { OutletEntity } from 'src/outlet/entity/outlet.entity';
import { FilterDto } from 'src/_common/filter.dto';
import { IndividualDTO } from './dto/individual.dto';
import { ProfessionalGroupEntity } from 'src/professional-group/entities/professional-group.entity';

@EntityRepository(AccountEntity)
export class AccountRepository extends Repository<AccountEntity> {
  public async register(dto: RegisterDTO): Promise<boolean> {
    const isExists = await this.findOne({ email: dto.email });
    if (isExists) {
      throw new HttpException(
        { error: `${dto.email} already exists`, status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }

    const pcnExists = await this.findOne({ pcn: dto.pcn });
    if (pcnExists) {
      throw new BadRequestException(`The PCN Number '${dto.pcn}' is already in use.`)
    }

    if (dto.accountType === accountTypes.CORPORATE) {
      const organizatioNameExists = await this.findOne({ organizationName: dto.organizationName });

      if (organizatioNameExists) {
        throw new BadRequestException(`Organization with name '${dto.organizationName}' already exists.`);
      }

      const premiseNuExists = await this.findOne({ premiseNumber: dto.premiseNumber });
      if (premiseNuExists) {
        throw new BadRequestException(`The premise number '${dto.premiseNumber}' is already in use.`);
      }
    }

    const user = new AccountEntity();
    user.email = dto.email;
    user.accountType = dto.accountType;
    user.firstName = dto.firstName;
    user.lastName = dto.lastName;
    user.organizationName = dto.organizationName;
    user.pcn = dto.pcn;
    user.organizationCategory = dto.organizationCategory;
    user.premiseNumber = dto.premiseNumber;
    user.organizationId = dto.organizationId;
    user.createdBy = dto.email;
    user.isRegComplete = dto.isRegComplete;
    user.emailVerified = dto.emailVerified;
    user.typesOfPractice = dto.typesOfPractice;
    user.profession = dto.profession;
    user.professionOtherValue = dto.professionOtherValue;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(dto.password, user.salt);
    user.subscribeToJobAlert = this.stringToBoolean(dto.subscribeToJobAlert ? dto.subscribeToJobAlert : false);

    try {
      await user.save();
      if (dto.accountType === accountTypes.CORPORATE) {
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
        premiseNumber: user.premiseNumber,
        accountType: user.accountType,
        accountId: user.id,
        verified: user.emailVerified,
        pcnVerified: user.pcnVerified,
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `${user.organizationName}`,
        profileImage: user.accountType === accountTypes.PROFESSIONAL ? user.profileImage : user.premisesImage ? user.premisesImage : user.profileImage
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
    const result = await this.findOne(id, {relations: ['professionalGroups']});
    if (!result) {
      throw new HttpException(
        {
          error: `user with id ${id} does not exists`,
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      ); ` `
    }
    return this.buildUserRO(result);
  }

  public async findByEmail(email: string): Promise<UserDataRO | undefined> {
    const result = await this.findOne({ where: { email: email }, relations: ['professionalGroups'] });
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

  public async findUnverifedStaff(id: string, dto: FilterDto): Promise<UserDataRO[]> {
    dto.page = dto.page && +dto.page || 1;
    dto.take = dto.take && +dto.take || 50;
    let result = await this.find({
      where: { organizationId: id, staffStatus: staffStatus.PENDING, },
      take: dto.take,
      skip: dto.page * (dto.page - 1)
    })

    if (dto.search) {
      result = await this.find({
        where: [
          { organizationId: id, staffStatus: staffStatus.PENDING, firstName: ILike(`%${dto.search}%`) },
          { organizationId: id, staffStatus: staffStatus.PENDING, lastName: ILike(`%${dto.search}%`) },
          { organizationId: id, staffStatus: staffStatus.PENDING, address: ILike(`%${dto.search}%`) },
          { organizationId: id, staffStatus: staffStatus.PENDING, phoneNumber: ILike(`%${dto.search}%`) },
          { organizationId: id, staffStatus: staffStatus.PENDING, email: ILike(`%${dto.search}%`) },
          { organizationId: id, staffStatus: staffStatus.PENDING, organizationName: ILike(`%${dto.search}%`) },
          { organizationId: id, staffStatus: staffStatus.PENDING, city: ILike(`%${dto.search}%`) },
          { organizationId: id, staffStatus: staffStatus.PENDING, pcn: ILike(`%${dto.search}%`) }
        ],
        take: dto.take,
        skip: 25 * (dto.page - 1)
      })
    }

    return this.buildUserArrRO(result);
  }

  public async findVerifedStaff(id: string, dto: FilterDto): Promise<UserDataRO[]> {
    dto.page = dto.page && +dto.page || 1;
    dto.take = dto.take && +dto.take || 50;
    let result = await this.find({
      where: { organizationId: id, staffStatus: staffStatus.VERIFIED, },
      take: dto.take,
      skip: dto.page * (dto.page - 1)
    })

    if (dto.search) {
      result = await this.find({
        where: [
          { organizationId: id, staffStatus: staffStatus.VERIFIED, firstName: ILike(`%${dto.search}%`) },
          { organizationId: id, staffStatus: staffStatus.VERIFIED, lastName: ILike(`%${dto.search}%`) },
          { organizationId: id, staffStatus: staffStatus.VERIFIED, address: ILike(`%${dto.search}%`) },
          { organizationId: id, staffStatus: staffStatus.VERIFIED, phoneNumber: ILike(`%${dto.search}%`) },
          { organizationId: id, staffStatus: staffStatus.VERIFIED, email: ILike(`%${dto.search}%`) },
          { organizationId: id, staffStatus: staffStatus.VERIFIED, organizationName: ILike(`%${dto.search}%`) },
          { organizationId: id, staffStatus: staffStatus.VERIFIED, city: ILike(`%${dto.search}%`) },
          { organizationId: id, staffStatus: staffStatus.VERIFIED, pcn: ILike(`%${dto.search}%`) }
        ],
        take: dto.take,
        skip: dto.take * (dto.page - 1)
      })
    }

    return this.buildUserArrRO(result);
  }

  async findAllCompletedAccounts(dto: FilterDto): Promise<UserDataRO[]> {
    dto.page = dto.page && +dto.page || 1;
    dto.take = dto.take && +dto.take || 50;
    let result = null;

    if (dto.search) {
      //TODO: optimise query 
      result = await this.createQueryBuilder("acc")
        .andWhere("acc.isRegComplete = true")
        .andWhere("acc.isRegComplete = ('corporate' || 'professional')")
        .where(new Brackets(qb => {
          qb.where("acc.firstName ILike :search", { search: `%${dto.search}%` })
            .orWhere("acc.lastName ILike :search", { search: `%${dto.search}%` })
            .orWhere("acc.phoneNumber ILike :search", { search: `%${dto.search}%` })
            .orWhere("acc.email ILike :search", { search: `%${dto.search}%` })
            .orWhere("acc.organizationName ILike :search", { search: `%${dto.search}%` })
            .orWhere("acc.pcn ILike :search", { search: `%${dto.search}%` })
        }))
        .take(50)
        .skip(50 * (dto.page ? dto.page - 1 : 0))
        .orderBy( 'acc.pcnVerified', 'ASC')
        .addOrderBy('acc.accountType', 'ASC')
        .addOrderBy('acc.firstName', 'ASC')
        .addOrderBy('acc.organizationName','ASC')
        .getMany();
    }
    else {
      result = await this.find({
        where: [
          { isRegComplete: true, accountType: accountTypes.CORPORATE },
          { isRegComplete: true, accountType: accountTypes.PROFESSIONAL }
        ],
        take: dto.take,
        skip: 50 * (dto.page - 1),
        order: { pcnVerified: 'ASC', accountType:'ASC', firstName: 'ASC', organizationName:'ASC' }
      })
    }

    return this.buildUserArrRO(result);
  }

  public async verifyStaff(id: string): Promise<UserDataRO> {
    const result = await this.findOne(id)
    result.staffStatus = staffStatus.VERIFIED
    result.message = "";
    return await this.save(result)
  }

  public async verifyPCN(id: string): Promise<boolean> {
    const result = await this.findOne(id)
    result.pcnVerified = true
    await this.save(result);
    return true;
  }

  public async rejectStaff(id: string, message: string): Promise<UserDataRO> {
    const result = await this.findOne(id)
    message = `${message} :By - ${result.organizationName}`;
    result.staffStatus = staffStatus.REJECTED;
    result.organizationName = null;
    result.organizationId = null;
    result.message = message;
    return await this.save(result);
  }

  public async updateUser<T>(
    email: string,
    toUpdate: T,
    user: AccountEntity
  ): Promise<UserDataRO | undefined> {
    
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
    console.log(user);
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
      pcnVerified: user.pcnVerified,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      isLocked: user.isLocked,
      lastName: user.lastName,
      latitude: user.latitude,
      firstName: user.firstName,
      longitude: user.longitude,
      phoneNumber: user.phoneNumber,
      yearOfGraduation: user.yearOfGraduation,
      school: user.school,
      schoolOtherValue: user.schoolOtherValue,
      profileImage: user.profileImage,
      accountPackage: user.accountPackage,
      organizationName: user.organizationName,
      organizationType: user.organizationType,
      organizationCategory: user.organizationCategory,
      organizationId: user.organizationId,
      staffStatus: user.staffStatus,
      typesOfPractice: user.typesOfPractice,
      isRegComplete: user.isRegComplete,
      premiseNumber: user.premiseNumber,
      accountType: user.accountType,
      profession: user.profession,
      professionOtherValue: user.professionOtherValue,
      professionalGroup: user.professionalGroup,
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
      numberofEmployees: user.numberofEmployees,
      professionalGroups: user.professionalGroups
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
        id: user.id,
        pcn: user.pcn,
        latitude: user.latitude,
        longitude: user.longitude,
        organizationName: user.organizationName,
        organizationType: user.organizationType,
        organizationCategory: user.organizationCategory,
        companyRegistrationNumber: user.companyRegistrationNumber,
        joined: user.createdAt,
        typeOfPractice: user.typesOfPractice,
        phoneNumber: user.phoneNumber,
        email: user.email,
        logo: user.profileImage,
        website: user.website,
        noOfEmployees: user.numberofEmployees,
        premiseNumber: user.premiseNumber
      };
      userArr.push(userRO);
    });
    return userArr;
  }

  stringToBoolean(val: any) {
    if (val === false) return false;
    if (val === true) return true;
    switch (val.toLowerCase().trim()) {
      case 'true': return true;
      case 'false': return false;
      default: return Boolean(val);
    }
  }
}
