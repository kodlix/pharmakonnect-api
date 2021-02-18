import { StateEntity } from 'src/state/entities/state.entity';

import { BaseEntity, Column, Entity, ManyToOne } from "typeorm";

@Entity('lga')
export class LgaEntity extends BaseEntity {
    @Column({primary: true})
    public id: number;
    @Column({ length: 200 })
    public name: string;

    @ManyToOne(() => StateEntity, s => s.lgas)
    state: StateEntity;

    @Column()
    stateId: number;

}
