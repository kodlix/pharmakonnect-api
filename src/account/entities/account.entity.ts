import { IsDate, IsEmail, IsFQDN, IsInt, IsNumber, Length, Min } from "class-validator";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { Column, Entity } from "typeorm";

@Entity('Account')
export class AccountEntity extends AbstractBaseEntity {

    // co-operation and individual
    @IsEmail()
    @Length(128)
    @Column({ unique: true, length: 128 })
    email: string

    @Min(8)
    @Column()
    password: string

    @Length(128)
    @Column({ length: 128 })
    accounType: string

    @Length(128)
    @Column({ length: 128 })
    accountPackage: string

    @Length(128)
    @Column({ length: 128, nullable: true })
    accountStatus: string

    @Column({ default: false })
    isLocked: boolean

    @Column({ default: true })
    isActive: boolean

    @Column({ default: false })
    pcnVerified: boolean

    @Column({ default: false })
    isReported: boolean

    @IsNumber()
    @Length(128)
    @Column({ length: 128 })
    phoneNumber: string

    @Length(128)
    @Column({ length: 128 })
    country: string

    @Length(128)
    @Column({ length: 128 })
    state: string

    @Length(200)
    @Column({ length: 200 })
    lga: string

    @Length(200)
    @Column({ length: 200 })
    city: string

    @Length(200)
    @Column({ length: 200 })
    address: string

    @Length(50)
    @Column({ default: '', length: 50 })
    pcn: string

    @Length(128)
    @Column({ default: '', length: 128 })
    sectorId: string

    @Column()
    longitude: number

    @Column()
    latitude: number

    @Column({ default: '' })
    profileImage: string

    // individual
    @Length(256)
    @Column({ length: 256, default: '' })
    firstName: string

    @Length(256)
    @Column({ length: 256, default: '' })
    lastName: string

    @IsDate()
    @Column({ nullable: true })
    dateOfBirth: Date

    @Column({ default: false })
    isPracticing: boolean

    // co-operation 
    @Length(256)
    @Column({ length: 256, default: '' })
    organizationName: string

    @Length(128)
    @Column({ length: 128, default: '' })
    organizationType: string

    @IsInt()
    @Column()
    numberofEmployees: number

    @Column({ default: '' })
    premisesImage?: string

    @Length(50)
    @Column({ length: 50, default: '' })
    companyRegistrationNumber?: string

    @IsInt()
    @Column({default: 0})
    yearofEstablishment: number

    @IsDate()
    @Column('timestamp', {default: (): string => 'LOCALTIMESTAMP' })
    openingTime?: Date

    @IsDate()
    @Column('timestamp', { default: (): string => 'LOCALTIMESTAMP' })
    closingTime?: Date

    @IsFQDN()
    @Column({ default: '' })
    website?: string
}

