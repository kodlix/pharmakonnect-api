import { AccountEntity } from 'src/account/entities/account.entity';
import { StateEntity } from 'src/state/entities/state.entity';

import { BaseEntity, Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity('lga')
export class LgaEntity extends BaseEntity {
    @Column({ primary: true })
    public id: number;
    @Column({ length: 200 })
    public name: string;

    @ManyToOne(() => StateEntity, s => s.lgas)
    state: StateEntity;

    @OneToMany(() => AccountEntity, s => s._lga)
    accounts: AccountEntity[];

    @Column()
    stateId: number;

}
