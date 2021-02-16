import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { AccountEntity } from "./entities/account.entity";
import { RegisterDTO, LoginDTO, LockUserDTO } from "./dto/credential.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { UserFromDbRO } from "./interfaces/account.interface";
import { UserDataRO } from "./interfaces/user.interface";

@EntityRepository(AccountEntity)
export class AccountRepository extends Repository<AccountEntity> {

    public async register({ email, password, accountType }: RegisterDTO): Promise<string> {
        const isExists = await await this.findOne({ email });
        if (isExists) {
            throw new HttpException({ error: `${email} already exists`, status: HttpStatus.BAD_REQUEST },
                HttpStatus.BAD_REQUEST);
        }
        const user = new AccountEntity();
        user.email = email;
        user.accountType = accountType;
        user.createdBy = email;
        user.accountPackage = 'Free';
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        try {
            await user.save();
            const message = 'Registration successful';
            return message;
        } catch (error) {
            throw new HttpException({ error: `An error occured`, status: HttpStatus.INTERNAL_SERVER_ERROR },
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async validateUserPassword({ email, password }: LoginDTO): Promise<UserFromDbRO> {
        const user = await await this.findOne({ where: { email: email } });
        if (user && await user.validatePassword(password)) {
            let data = {
                email, accountPackage: user.accountPackage,
                isRegComplete: user.isRegComplete, accountType: user.accountType
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
            throw new HttpException({
                error: `user with id ${id} does not exists`, status: HttpStatus.NOT_FOUND
            },
                HttpStatus.NOT_FOUND);
        }
        return this.buildUserRO(result);
    }

    public async findByEmail(email: string): Promise<UserDataRO | undefined> {
        const result = await this.findOne({ where: { email: email } });
        if (!result) {
            throw new HttpException({
                error: `${email} does not exists`, status: HttpStatus.NOT_FOUND
            }, HttpStatus.NOT_FOUND);
        }
        return this.buildUserRO(result);
    }

    public async updateUser<T>(email: string, toUpdate: T): Promise<UserDataRO | undefined> {
        const user = await this.findOne({ where: { email: email } });
        if (!user) {
            throw new HttpException({
                error: `User with email: ${email} does not exists`, status: HttpStatus.NOT_FOUND
            }, HttpStatus.NOT_FOUND);
        }
        const result = await this.merge(user, toUpdate);
        await this.save(user);
        return this.buildUserRO(result);
    }

    public async lockAndUnlockUser({ email, isLocked }: LockUserDTO): Promise<UserDataRO | undefined> {
        const user = await this.findOne({ where: { email: email } });
        if (!user) {
            throw new HttpException({
                error: `User with email: ${email} does not exists`, status: HttpStatus.NOT_FOUND
            }, HttpStatus.NOT_FOUND);
        }
        user.isLocked = isLocked;
        const result = await await user.save();
        return this.buildUserRO(result);
    }

    private buildUserRO(user: AccountEntity) {
        const userRO = {
          id: user.id,
          pcn: user.pcn,
          email: user.email,
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
          isRegComplete: user.isRegComplete,
          accountType: user.accountType
        };
        return userRO;
      }

      public buildUserArrRO(users: AccountEntity[]) {
        let userArr = [];
        users.forEach(user => {
            userArr.push(this.buildUserRO(user));
        })
        return userArr;
      }

}