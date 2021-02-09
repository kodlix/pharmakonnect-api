export interface UserDataRO {
    id: string;
    email: string;
    organizationName: string;
    organizationType: string;
    accountPackage: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    pcn: string;
    profileImage: string;
    longitude: number;
    latitude: number;
}

export interface JwtPayload {
    email: string;
  }