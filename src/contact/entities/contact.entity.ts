import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractBaseEntity } from "src/_common/base.entity";

@Entity("Contact")
export class ContactEntity extends AbstractBaseEntity {
    @Column()
    creatorId: string

    @Column()
    accountId: string

}