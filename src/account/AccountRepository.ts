import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { AccountEntity } from "./entities/account.entity";
import { RegisterDto, LoginDto } from "./dto/auth-credential.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { CooperateRO, IndividualRO } from "./interfaces/account.interface";
import { UserDataRO } from "./interfaces/user.interface";
import { CooperateDTO } from "./dto/cooperate.dto";
import { IndividualDTO } from "./dto/individual.dto";

@EntityRepository(AccountEntity)
export class AccountRepository extends Repository<AccountEntity> {

    public async register(registerDto: RegisterDto): Promise<string> {
        const { email, password, accounType } = registerDto;
        const user = new AccountEntity();
        user.email = email;
        user.accounType = accounType;
        user.createdBy = email;
        user.accountPackage = 'Free';
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        try {
            await user.save();
            const message = 'Registration successful';
            return message;
        } catch (error) {
            if (error.code === '23505') { // duplicate email
                throw new HttpException({ message: `${email} already exists` }, HttpStatus.BAD_REQUEST);
            } else {
                throw new HttpException({ message: `An error occured` }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    public async validateUserPassword(loginDto: LoginDto): Promise<string> {
        const { email, password } = loginDto;
        const user = await await this.findOne({ email });
        if (user && await user.validatePassword(password)) {
            return user.email;
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
            throw new HttpException({ message: `user with id ${id} does not exists` }, HttpStatus.NOT_FOUND);
        }
        return result;
    }

    public async findByEmail(email: string): Promise<UserDataRO | undefined> {
        const result = await this.findOne({ where: { email: email } });
        if (!result) {
            throw new HttpException({ message: `${email} does not exists` }, HttpStatus.NOT_FOUND);
        }
        return result;
    }

    public async updateIndividual(id: string, toUpdate: IndividualDTO): Promise<IndividualRO> {
        const user = await this.findOne(id);
        if (!user) {
            throw new HttpException({ message: `user with id ${id} does not exists` }, HttpStatus.NOT_FOUND);
        }
        await this.merge(user, toUpdate);
        return await this.save(user);
    }

    public async updateCooperate(id: string, recordToUpdate: CooperateDTO): Promise<CooperateRO> {
        const user = await this.findOne(id);
        if (!user) {
            throw new HttpException({ message: `user with id ${id} does not exists` }, HttpStatus.NOT_FOUND);
        }
        await this.merge(user, recordToUpdate);
        return await this.save(user);
    }

}