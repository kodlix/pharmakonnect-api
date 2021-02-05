import { IsNotEmpty } from "class-validator";

export class RegisterDto {
   
    @IsNotEmpty()
    public email: string;
    
    @IsNotEmpty()
    public password: string;
    
    @IsNotEmpty()
    public accounType: string

    @IsNotEmpty()
    public accountPackage: string

    @IsNotEmpty()
    public phoneNumber: string

    @IsNotEmpty()
    public country: string

    @IsNotEmpty()
    public state: string

    @IsNotEmpty()
    public lga: string

    @IsNotEmpty()
    public city: string

    @IsNotEmpty()
    public address: string

    @IsNotEmpty()
    public longitude: number

    @IsNotEmpty()
    public latitude: number  

    public pcn: string
    public profileImage: string
    public firstName: string
    public lastName: string
    public dateOfBirth: Date
    public organizationName: string
    public organizationType: string
    public numberofEmployees: number
    public premisesImage: string
    public companyRegistrationNumber: string
    public yearofEstablishment: number
    public openingTime?: Date
    public closingTime?: Date
    public website: string
} 
