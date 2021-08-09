import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({
  expression: `
   select * from "Contact" contact
     `
})

export class ContactView
{
    @ViewColumn()
    id: string

    @ViewColumn()
    ownerId: string

    @ViewColumn()
    ownerName: string

    @ViewColumn()
    groupId: string

    @ViewColumn()
    groupName: string

    @ViewColumn()
    groupDescription: string;

    @ViewColumn()
    logo: string

    @ViewColumn()
    email: string;

    @ViewColumn()
    accountType: string;

    @ViewColumn()
    firstName: string;

    @ViewColumn()
    lastName: string;

    @ViewColumn()
    profileImage: string;

    @ViewColumn()
    organizationName: string;

    @ViewColumn()
    address: string;

    @ViewColumn()
    city: string;

    @ViewColumn()
    state: string;

    @ViewColumn()
    lga: string;

    @ViewColumn()
    typesOfPractice: string;

    @ViewColumn()
    phoneNumber: string;

    @ViewColumn()
    pcn: string;

    @ViewColumn()
    gender: string;
    
}