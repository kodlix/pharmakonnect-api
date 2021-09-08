export interface UserDataRO {
    id: string;
    email: string;
    organizationName: string;
    organizationType: string;
    organizationCategory: string;
    accountPackage: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    pcn: string;
    profileImage: string;
    longitude: number;
    latitude: number;
    isLocked: boolean;
    isRegComplete: boolean;
    accountType: string;
    country: string;
    state: string;
    lga: string;
    city: string;
    address: string;
    yearOfGraduation: string;
    school: string;
    stateName?: string;
    countryName?: string;
    lgaName?: string;
}
export interface JwtPayload {
    email: string;
}
export interface OrganizationRO {
    organizationName: string;
    organizationType: string;
    organizationCategory: string;
    companyRegistrationNumber: string;
    pcn: string;
    longitude: number;
    latitude: number;
    website: string;
    openingTime: string;
    closingTime: string;
    numberofEmployees: string;
    yearofEstablishment: number;
}

