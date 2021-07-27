import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({
  expression: `
    SELECT "account"."id" as "id", "account"."email" as "email", "account"."accountType" as "accountType", "account"."firstName" as "firstName",
    "account"."lastName" as "lastName", "account"."profileImage" as "profileImage",  "account"."organizationName" as "organizationName",
    "account"."address" as "address", "account"."city" as "city", "group"."ownerId" as "ownerId" FROM "Account" "account"
    LEFT JOIN "GroupMember" "group" ON "account"."id" = "group"."ownerId"
     `
})

export class GroupMemeberView
{
    @ViewColumn()
    id: string

    @ViewColumn()
    ownerId: string

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
    
}