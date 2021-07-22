import { Column, Entity } from "typeorm";
import { AbstractBaseEntity } from "src/_common/base.entity";

@Entity("Contact")
export class ContactEntity extends AbstractBaseEntity {

    @Column()
    creatorId: string

    @Column()
    accountId: string

    @Column({nullable: true})
    firstName: string

    @Column({nullable: true})
    lastName: string

    @Column({ nullable: true})
    phoneNo: string

    @Column({ nullable: true})
    email: string

}