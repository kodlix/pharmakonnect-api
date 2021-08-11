import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({
  expression: `
    SELECT "account"."id" as "id", "account"."email" as "email", 
    "account"."accountType" as "accountType", "account"."firstName" as "firstName",
     "account"."lastName" as "lastName", "account"."profileImage" as "profileImage",  
     "account"."organizationName" as "organizationName", "account"."address" as "address",
     "account"."state" as "state", "account"."lga" as "lga", "account"."typesOfPractice" as "typesOfPractice",
     "account"."pcn" as "pcn", "account"."phoneNumber" as "phoneNumber", "account"."gender" as "gender",
     "groupMember"."contactId" as "contactId", "groupMember"."groupId" as "groupId",
     "group"."name" as "groupName", "group"."description" as "groupDescription", "group"."logo" as "logo", "group"."ownerName" as "ownerName",
     "account"."city" as "city", "groupMember"."ownerId" as "ownerId" FROM "Account" "account"
    LEFT JOIN "GroupMember" "groupMember" ON "account"."id" = "groupMember"."contactId"
    LEFT JOIN "Group" "group" ON "group"."id" = "groupMember"."groupId"
    WHERE ("account"."accountType" = 'individual' OR "account"."accountType" = 'corporate' )  AND "groupMember"."ownerId" IS NOT NULL
     `
})

export class GroupMemeberView
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