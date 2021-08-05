import { Expose } from "class-transformer";

export class GroupDto {
    @Expose()
    groupId: string

    @Expose()
    ownerId: string

    @Expose()
    ownerName: string

    @Expose()
    groupName: string

    @Expose()
    groupDescription: string;

    @Expose()
    logo: string;

    @Expose()
    members:  MemberDto[];
}

export class MemberDto {
    @Expose()
    id: string

    @Expose()
    groupId: string

    @Expose()
    groupName: string

    @Expose()
    groupDescription: string

    @Expose()
    email: string;

    @Expose()
    accountType: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    profileImage: string;

    @Expose()
    organizationName: string;

    @Expose()
    address: string;

    @Expose()
    city: string;  
}
