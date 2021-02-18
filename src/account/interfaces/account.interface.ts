export interface UserRO {
    email: string;
    token: string;
    expires_in: number;
    accountPackage: string;
    isRegComplete: boolean;
    accountType: string;
}

export interface UserFromDbRO {
    email: string;
    accountPackage: string;
    isRegComplete: boolean;
    accountType: string;
}

export interface IndividualRO {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    pcn: string;
    profileImage: string;
}

export interface CorperateRO {
    id: string;
    email: string;
    organizationName: string;
    phoneNumber: string;
    pcn: string;
    profileImage: string;
}

export interface RegisterSeedRO {
    email: string;
    password: string;
    accountType: string;
    isRegComplete: boolean;
}