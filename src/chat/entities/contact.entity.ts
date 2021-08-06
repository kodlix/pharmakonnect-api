import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractBaseEntity } from "src/_common/base.entity";
import { AccountEntity } from "src/account/entities/account.entity"

@Entity("Contact")
export class Contact extends AbstractBaseEntity{

    @ManyToOne(()=> AccountEntity, account => account.id)
    @Column()
    creatorId : string

    @ManyToOne(()=> AccountEntity, account => account.id)
    @Column()
    accountId : string

    @Column()
    firstName : string

    @Column()
    lastName : string

    @Column()
    phoneNumber : string

    @Column()
    email : string

}