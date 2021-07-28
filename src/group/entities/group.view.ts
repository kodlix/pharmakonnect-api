import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({
  expression: `
  SELECT 
     "group"."name" as "name", "group"."description" as "description", 
	   "group"."id" as "id", "group"."createdAt" as "createdAt", 
    "group"."logo" as "logo", COUNT("groupMember"."groupId" ) as "memberCount",
    "group"."ownerId" as "ownerId" FROM "Group" "group"
    LEFT JOIN "GroupMember" "groupMember" ON "group"."id" = "groupMember"."groupId"
	  GROUP BY "group"."name",  "group"."description","group"."id",
	  "group"."ownerId", "group"."createdAt", "group"."logo"
     `
})

export class GroupView {
  @ViewColumn()
  name: string

  @ViewColumn()
  description: string

  @ViewColumn()
  id: string;

  @ViewColumn()
  ownerId: string;

  @ViewColumn()
  memberCount: number;

  @ViewColumn()
  logo: string;

  @ViewColumn()
  createdAt: Date;

}