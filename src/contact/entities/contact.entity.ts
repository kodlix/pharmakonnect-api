import { Column, Entity } from "typeorm";
import { AbstractBaseEntity } from "src/_common/base.entity";

@Entity("Contact")
export class ContactEntity extends AbstractBaseEntity {

    @Column()
    creatorId: string

    @Column()
    accountId: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    phoneNumber: string

    @Column()
    email: string

}