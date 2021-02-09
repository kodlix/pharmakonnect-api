import { IsDate, IsEmail, IsFQDN, IsInt, Length } from "class-validator";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity('Account')
export class AccountEntity extends AbstractBaseEntity {

    // co-operation and individual
    @IsEmail()
    @Length(128)
    @Column({ unique: true, length: 128 })
    public email: string;

    @Column()
    public password: string;

    @Length(128)
    @Column({ length: 128 })
    public accounType: string;

    @Length(128)
    @Column({ length: 128 })
    public accountPackage: string;

    @Length(128)
    @Column({ length: 128, nullable: true })
    public accountStatus: string;

    @Column({ type: 'bool', default: false })
    public isLocked: boolean = false;

    @Column({ type: 'bool', default: true })
    public isActive: boolean = true;

    @Column({ type: 'bool', default: false })
    public pcnVerified: boolean = false;

    @Column({ type: 'bool', default: false })
    public isReported: boolean;

    @Length(128)
    @Column({ length: 128, nullable: true })
    public phoneNumber: string;

    @Length(128)
    @Column({ length: 128, nullable: true })
    public country: string;

    @Length(128)
    @Column({ length: 128, nullable: true })
    public state: string;

    @Length(200)
    @Column({ length: 200, nullable: true })
    public lga: string;

    @Length(200)
    @Column({ length: 200, nullable: true })
    public city: string;

    @Length(200)
    @Column({ length: 200, nullable: true })
    public address: string;

    @Length(50)
    @Column({ nullable: true, length: 50 })
    public pcn: string;

    @Length(128)
    @Column({ nullable: true, length: 128 })
    public sectorId: string;

    @Column({type: 'float',  default: 0 })
    public longitude: number;

    @Column({type: 'float',  default: 0 })
    public latitude: number;

    @Column({ nullable: true })
    public profileImage: string;

    // individual
    @Length(256)
    @Column({ length: 256, nullable: true })
    public firstName: string;

    @Length(256)
    @Column({ length: 256, nullable: true })
    public lastName: string;

    @IsDate()
    @Column({ nullable: true })
    public dateOfBirth: Date;

    @Column({ type: 'bool', default: false })
    public isPracticing: boolean = false;

    @Length(20)
    @Column({ length: 20, nullable: true })
    public gender: string;

    // co-operation 
    @Length(256)
    @Column({ length: 256, nullable: true })
    public organizationName: string;

    @Length(128)
    @Column({ length: 128, nullable: true })
    public organizationType: string;

    @IsInt()
    @Column({ default: 0 })
    public numberofEmployees: number;

    @Column({ nullable: true })
    public premisesImage: string;

    @Length(50)
    @Column({ length: 50, default: '' })
    public companyRegistrationNumber?: string;

    @IsInt()
    @Column({ default: 0 })
    public yearofEstablishment: number;

    @IsDate()
    @Column('timestamp', { default: (): string => 'LOCALTIMESTAMP' })
    public openingTime?: Date;

    @IsDate()
    @Column('timestamp', { default: (): string => 'LOCALTIMESTAMP' })
    public closingTime?: Date;

    @IsFQDN()
    @Column({ nullable: true })
    public website: string;

    @Column()
    public salt: string;

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}

